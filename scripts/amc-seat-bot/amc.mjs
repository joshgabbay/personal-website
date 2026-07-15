// AMC data providers: turn a showtime into a normalized list of seats.
//
// A provider is `{ name, async fetchSeats() }` returning:
//   {
//     showtime: { id, url, movie, theatre, when, soldOut },
//     seats:    [ { id, row, column, available } ]
//   }
//
// Three providers ship here:
//   - "amc-api"  official REST API (needs a free vendor key). Most reliable.
//   - "amc-web"  scrapes the public seat page. No key, but best-effort/fragile.
//   - "mock"     synthetic data for testing the pipeline with no network.
//
// AMC's seat JSON shape has drifted across API versions (v2/v3) and the web
// app, so seat extraction is deliberately schema-tolerant: it walks the whole
// response and collects anything that looks like a seat. If AMC changes things,
// run the bot with `--debug` to dump the raw payload and adjust the helpers
// near the bottom of this file.

const API_BASE = "https://api.amctheatres.com";
const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function getJson(url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": USER_AGENT, ...headers },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`GET ${url} -> HTTP ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function getText(url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": USER_AGENT, ...headers },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`GET ${url} -> HTTP ${res.status} ${res.statusText}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

export function seatPageUrl(showtimeId) {
  return `https://www.amctheatres.com/showtimes/${showtimeId}/seats`;
}

// ---------------------------------------------------------------------------
// Provider: official AMC API
// ---------------------------------------------------------------------------

// Walk a HAL `_links` object and return the first href whose relation looks
// like a seating layout.
function findSeatingLayoutLink(node) {
  const links = node?._links;
  if (!links || typeof links !== "object") return null;
  for (const [rel, value] of Object.entries(links)) {
    if (!/seat/i.test(rel)) continue;
    const href = Array.isArray(value) ? value[0]?.href : value?.href;
    if (href) return href;
  }
  return null;
}

function withQuery(url, params) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (entries.length === 0) return url;
  const u = new URL(url);
  for (const [k, v] of entries) u.searchParams.set(k, String(v));
  return u.toString();
}

function amcApiProvider(config) {
  const { showtimeId, vendorKey } = config;
  const headers = { "X-AMC-Vendor-Key": vendorKey };

  return {
    name: "amc-api",
    async fetchSeats() {
      let showtime = {
        id: showtimeId,
        url: seatPageUrl(showtimeId),
        movie: undefined,
        theatre: undefined,
        when: undefined,
        soldOut: undefined,
      };
      let layoutUrl = config.seatingLayoutUrl || null;

      // Resolve showtime metadata + the seating-layout link (best effort).
      try {
        const st = await getJson(`${API_BASE}/v2/showtimes/${showtimeId}`, headers);
        showtime = {
          ...showtime,
          movie: st.movieName ?? st.name ?? showtime.movie,
          theatre: st.theatreName ?? st.theatre?.name ?? showtime.theatre,
          when: st.showDateTimeLocal ?? st.utcDateTime ?? st.when ?? showtime.when,
          soldOut: st.isSoldOut ?? showtime.soldOut,
        };
        layoutUrl = layoutUrl || findSeatingLayoutLink(st);
      } catch (err) {
        // Non-fatal: we can still try conventional seating URLs below.
        if (config.debug) {
          process.stderr.write(`[amc-api] showtime lookup failed: ${err.message}\n`);
        }
      }

      // Candidate seating-layout endpoints, in order of preference.
      const candidates = [
        layoutUrl,
        `${API_BASE}/v3/seating-layout?showtimeId=${showtimeId}`,
        `${API_BASE}/v2/seating-layouts/${showtimeId}`,
      ].filter(Boolean);

      let raw = null;
      let lastErr = null;
      for (const base of candidates) {
        const url = withQuery(base, {
          accountId: config.accountId,
          loyaltyCardNumber: config.loyaltyCardNumber,
        });
        try {
          raw = await getJson(url, headers);
          break;
        } catch (err) {
          lastErr = err;
        }
      }
      if (raw == null) {
        throw new Error(
          `could not load seating layout for showtime ${showtimeId}: ` +
            `${lastErr?.message ?? "no candidate endpoint worked"}. ` +
            `Tip: open the seat page in your browser, copy the seating-layout ` +
            `request URL from DevTools, and set "seatingLayoutUrl" in your config.`,
        );
      }

      return { showtime, seats: collectSeats(raw), raw: config.debug ? raw : undefined };
    },
  };
}

// ---------------------------------------------------------------------------
// Provider: public web page (no key required, best effort)
// ---------------------------------------------------------------------------

function extractEmbeddedJson(html) {
  const blobs = [];
  // Next.js hydration payload.
  const nextData = html.match(
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (nextData) blobs.push(nextData[1]);
  // Common client-state globals.
  const globals = [
    /__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});/,
    /__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\});/,
    /window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]*?\});/,
  ];
  for (const re of globals) {
    const m = html.match(re);
    if (m) blobs.push(m[1]);
  }
  const parsed = [];
  for (const blob of blobs) {
    try {
      parsed.push(JSON.parse(blob));
    } catch {
      /* ignore unparseable blobs */
    }
  }
  return parsed;
}

function amcWebProvider(config) {
  const { showtimeId } = config;
  const url = seatPageUrl(showtimeId);
  return {
    name: "amc-web",
    async fetchSeats() {
      const html = await getText(url);
      const blobs = extractEmbeddedJson(html);
      let seats = [];
      for (const blob of blobs) {
        const found = collectSeats(blob);
        if (found.length > seats.length) seats = found;
      }
      if (seats.length === 0 && config.debug) {
        process.stderr.write(
          `[amc-web] no seats parsed from ${url}. The page may be ` +
            `Cloudflare-gated or the embedded shape changed. Prefer the ` +
            `amc-api provider, or adjust extractEmbeddedJson()/collectSeats().\n`,
        );
      }
      return {
        showtime: { id: showtimeId, url, movie: undefined, theatre: undefined },
        seats,
        raw: config.debug ? blobs : undefined,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Provider: mock (offline testing)
// ---------------------------------------------------------------------------

// Builds a small grid; a seat is "available" if its id is listed in the
// MOCK_AVAILABLE env var (comma-separated). Lets you deterministically test
// baseline -> new-seat detection without any network or key.
function mockProvider(config, env = process.env) {
  const rows = ["A", "B", "C"];
  const cols = [1, 2, 3, 4, 5];
  const available = new Set(
    (env.MOCK_AVAILABLE ?? "A1,A2")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return {
    name: "mock",
    async fetchSeats() {
      const seats = [];
      for (const row of rows) {
        for (const column of cols) {
          const id = `${row}${column}`;
          seats.push({ id, row, column: String(column), available: available.has(id) });
        }
      }
      return {
        showtime: {
          id: config.showtimeId ?? "mock",
          url: seatPageUrl(config.showtimeId ?? "mock"),
          movie: "Mock Movie",
          theatre: "Mock Theatre",
        },
        seats,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Schema-tolerant seat extraction
// ---------------------------------------------------------------------------

const AVAILABLE_WORDS = new Set([
  "available",
  "open",
  "free",
  "unsold",
  "unoccupied",
  "empty",
  "selectable",
]);
const TAKEN_WORDS = new Set([
  "taken",
  "sold",
  "unavailable",
  "occupied",
  "held",
  "hold",
  "blocked",
  "broken",
  "house",
  "companion",
  "wheelchair", // position markers, not buyable general seats
]);

function availabilityOf(obj) {
  // Explicit booleans win.
  if (typeof obj.available === "boolean") return obj.available;
  if (typeof obj.isAvailable === "boolean") return obj.isAvailable;
  if (typeof obj.selectable === "boolean") return obj.selectable;
  if (typeof obj.occupied === "boolean") return !obj.occupied;
  if (typeof obj.taken === "boolean") return !obj.taken;
  // Fall back to a status/state string.
  const status = obj.status ?? obj.state ?? obj.seatStatus ?? obj.availability;
  if (typeof status === "string") {
    const s = status.toLowerCase();
    if (AVAILABLE_WORDS.has(s)) return true;
    if (TAKEN_WORDS.has(s)) return false;
    // Substring fallback (e.g. "AVAILABLE_FOR_SALE").
    if ([...AVAILABLE_WORDS].some((w) => s.includes(w))) return true;
    if ([...TAKEN_WORDS].some((w) => s.includes(w))) return false;
  }
  return null; // not a recognizable seat
}

function scalar(value) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  // Tolerate row/section expressed as a nested object, e.g. row: { name: "A" }.
  if (value && typeof value === "object") {
    const inner = value.name ?? value.label ?? value.id;
    if (typeof inner === "string" || typeof inner === "number") return String(inner);
  }
  return undefined;
}

function seatRowOf(obj, ctx) {
  return scalar(obj.rowName ?? obj.row ?? obj.seatRow ?? obj.rowLabel) ?? ctx.row;
}

function seatColumnOf(obj) {
  return scalar(
    obj.columnName ??
      obj.column ??
      obj.seatColumn ??
      obj.number ??
      obj.seatNumber ??
      obj.name ??
      obj.label,
  );
}

function seatIdOf(obj, row, column, ctx) {
  // Prefer an explicit, stable id when the payload provides one.
  if (obj.id != null && typeof obj.id !== "object") return String(obj.id);
  if (obj.seatId != null && typeof obj.seatId !== "object") return String(obj.seatId);
  // Otherwise compose a unique id from position. `row` is inherited from the
  // parent row when the seat itself only carries a column/number.
  const composed = `${row ?? ""}${column ?? ""}`.trim();
  if (!composed) return null; // unidentifiable — skip rather than invent an id
  return ctx.section ? `${ctx.section}-${composed}` : composed;
}

// Recursively walk any JSON and collect seat-like objects. Seats commonly nest
// as auditorium -> rows -> seats, where the row letter lives on the row object
// and each seat only has its number, so we thread a positional context (row +
// section) down the tree to build correct, collision-free seat ids.
export function collectSeats(root) {
  const out = [];
  const seen = new Set();

  const walk = (node, ctx, depth) => {
    if (node == null || depth > 200) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item, ctx, depth + 1);
      return;
    }
    if (typeof node !== "object") return;

    // Extend positional context as we descend into a row/section container.
    const nextCtx = { ...ctx };
    const rowName = scalar(node.rowName ?? node.row ?? node.rowLabel);
    if (rowName !== undefined) nextCtx.row = rowName;
    const section = scalar(node.sectionName ?? node.section);
    if (section !== undefined) nextCtx.section = section;

    const availability = availabilityOf(node);
    if (availability !== null) {
      const row = seatRowOf(node, nextCtx);
      const column = seatColumnOf(node);
      const id = seatIdOf(node, row, column, nextCtx);
      if (id && !seen.has(id)) {
        seen.add(id);
        out.push({ id, row, column, available: availability });
      }
    }

    for (const value of Object.values(node)) {
      if (value && typeof value === "object") walk(value, nextCtx, depth + 1);
    }
  };

  walk(root, {}, 0);
  return out;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createProvider(config, env = process.env) {
  const name =
    config.provider || (config.vendorKey ? "amc-api" : "amc-web");
  switch (name) {
    case "amc-api":
      if (!config.vendorKey) {
        throw new Error(
          'provider "amc-api" needs a vendor key. Set AMC_VENDOR_KEY (request ' +
            "one free at https://developers.amctheatres.com/) or use provider " +
            '"amc-web".',
        );
      }
      return amcApiProvider(config);
    case "amc-web":
      return amcWebProvider(config);
    case "mock":
      return mockProvider(config, env);
    default:
      throw new Error(`unknown provider "${name}"`);
  }
}
