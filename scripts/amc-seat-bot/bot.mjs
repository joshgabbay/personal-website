#!/usr/bin/env node
// AMC seat bot — polls an AMC showtime's seating layout and notifies you when
// seats that were previously taken become available again.
//
// Quick start:
//   1. Find your showtime id: open the movie, click a time, and read the number
//      in the URL amctheatres.com/showtimes/<ID>/seats
//   2. Configure (env vars or config.json — see README + config.example.json).
//   3. Run:   node scripts/amc-seat-bot/bot.mjs --showtime <ID>
//
// Flags:
//   --showtime <id>     AMC showtime id (or set AMC_SHOWTIME_ID)
//   --provider <name>   amc-api | amc-web | mock
//   --interval <sec>    seconds between checks (default 60)
//   --once              run a single check, then exit (for cron / CI)
//   --notify-first      also notify about seats already open on the first check
//   --config <path>     path to a JSON config file
//   --state-file <path> where to persist seen seats (default ./.amc-seat-bot-state.json)
//   --debug             print the raw provider payload
//   --help

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { createProvider, seatPageUrl } from "./amc.mjs";
import { buildNotifiers, notifyAll } from "./notify.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Minimal .env loader (no dependency). Loads scripts/amc-seat-bot/.env and
// ./.env without overwriting variables already present in the environment.
// ---------------------------------------------------------------------------
function loadDotEnv(file) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

// ---------------------------------------------------------------------------
// Args + config
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      args._.push(a);
      continue;
    }
    const key = a.slice(2);
    const boolFlags = new Set(["once", "notify-first", "debug", "help"]);
    if (boolFlags.has(key)) {
      args[key] = true;
    } else {
      args[key] = argv[++i];
    }
  }
  return args;
}

function loadConfig(args) {
  let fileConfig = {};
  const configPath =
    args.config ?? process.env.AMC_BOT_CONFIG ?? path.join(HERE, "config.json");
  try {
    fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    /* no config file — env/flags only */
  }

  const env = process.env;
  const num = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const config = {
    showtimeId:
      args.showtime ?? env.AMC_SHOWTIME_ID ?? fileConfig.showtimeId ?? undefined,
    provider: args.provider ?? env.AMC_PROVIDER ?? fileConfig.provider ?? undefined,
    vendorKey: env.AMC_VENDOR_KEY ?? fileConfig.vendorKey ?? undefined,
    seatingLayoutUrl:
      env.AMC_SEATING_LAYOUT_URL ?? fileConfig.seatingLayoutUrl ?? undefined,
    accountId: env.AMC_ACCOUNT_ID ?? fileConfig.accountId ?? undefined,
    loyaltyCardNumber:
      env.AMC_LOYALTY_CARD ?? fileConfig.loyaltyCardNumber ?? undefined,
    intervalSeconds: num(
      args.interval ?? env.AMC_INTERVAL_SECONDS ?? fileConfig.intervalSeconds,
      60,
    ),
    jitterSeconds: num(
      env.AMC_JITTER_SECONDS ?? fileConfig.jitterSeconds,
      10,
    ),
    stateFile:
      args["state-file"] ??
      env.AMC_STATE_FILE ??
      fileConfig.stateFile ??
      path.join(process.cwd(), ".amc-seat-bot-state.json"),
    once: Boolean(args.once),
    notifyFirst: Boolean(args["notify-first"] ?? fileConfig.notifyFirst),
    desktop: Boolean(fileConfig.desktop),
    debug: Boolean(args.debug),
  };
  return config;
}

// ---------------------------------------------------------------------------
// State persistence: remember which seats were available last time.
// ---------------------------------------------------------------------------
function loadState(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function saveState(file, state) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, file);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(msg) {
  process.stdout.write(`[${stamp()}] ${msg}\n`);
}

function describeShowtime(showtime) {
  const bits = [showtime.movie, showtime.theatre, showtime.when].filter(Boolean);
  return bits.length ? bits.join(" · ") : `showtime ${showtime.id}`;
}

function buildMessage(showtime, newSeats) {
  const label = describeShowtime(showtime);
  const seatList = newSeats
    .map((s) => s.id)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .join(", ");
  const count = newSeats.length;
  return (
    `🎟️ ${count} new seat${count === 1 ? "" : "s"} available — ${label}\n` +
    `Seats: ${seatList}\n` +
    `Grab them: ${showtime.url ?? seatPageUrl(showtime.id)}`
  );
}

// ---------------------------------------------------------------------------
// One check: fetch → diff → notify → persist.
// ---------------------------------------------------------------------------
async function runCheck({ provider, notifiers, config, stateKey }) {
  const result = await provider.fetchSeats();
  const { showtime, seats } = result;

  if (config.debug) {
    log(`[debug] raw payload:\n${JSON.stringify(result.raw ?? result, null, 2).slice(0, 4000)}`);
  }

  const availableSeats = seats.filter((s) => s.available);
  const availableIds = availableSeats.map((s) => s.id);
  const availableSet = new Set(availableIds);

  const state = loadState(config.stateFile);
  const prior = state[stateKey];
  const priorSet = new Set(prior?.availableIds ?? []);

  const isFirstRun = !prior;
  const newSeats = availableSeats.filter((s) => !priorSet.has(s.id));
  const removed = [...priorSet].filter((id) => !availableSet.has(id));

  // Persist the current snapshot regardless of outcome.
  state[stateKey] = {
    availableIds,
    seatCount: seats.length,
    availableCount: availableIds.length,
    updatedAt: new Date().toISOString(),
    lastNotifiedAt: prior?.lastNotifiedAt ?? null,
  };

  const summary =
    `${describeShowtime(showtime)} — ${availableIds.length}/${seats.length || "?"} available` +
    (removed.length ? ` (${removed.length} just taken)` : "");

  let notified = false;
  if (isFirstRun) {
    if (config.notifyFirst && availableSeats.length > 0) {
      await notifyAll(notifiers, buildMessage(showtime, availableSeats), {
        title: "AMC seats available",
        showtimeId: showtime.id,
        url: showtime.url,
        seats: availableSeats.map((s) => s.id),
      });
      notified = true;
      log(`baseline recorded + notified about ${availableSeats.length} open seat(s). ${summary}`);
    } else {
      log(`baseline recorded (no alert on first run). ${summary}`);
    }
  } else if (newSeats.length > 0) {
    await notifyAll(notifiers, buildMessage(showtime, newSeats), {
      title: "AMC seats available",
      showtimeId: showtime.id,
      url: showtime.url,
      seats: newSeats.map((s) => s.id),
    });
    notified = true;
    log(`🔔 ${newSeats.length} new seat(s): ${newSeats.map((s) => s.id).join(", ")}. ${summary}`);
  } else {
    log(`no new seats. ${summary}`);
  }

  if (notified) state[stateKey].lastNotifiedAt = new Date().toISOString();
  saveState(config.stateFile, state);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const HELP = `AMC seat bot — notify when seats open up for a showtime.

Usage: node scripts/amc-seat-bot/bot.mjs --showtime <ID> [options]

Options:
  --showtime <id>      AMC showtime id (URL: amctheatres.com/showtimes/<ID>/seats)
  --provider <name>    amc-api | amc-web | mock   (default: amc-api if a vendor
                       key is set, else amc-web)
  --interval <sec>     seconds between checks (default 60)
  --once               run one check then exit (use with cron / CI)
  --notify-first       also alert about seats already open on the first check
  --config <path>      JSON config file (default: scripts/amc-seat-bot/config.json)
  --state-file <path>  where to persist seen seats
  --debug              dump the raw provider payload
  --help               show this help

Notifications are auto-enabled from env vars: TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID,
DISCORD_WEBHOOK_URL, SLACK_WEBHOOK_URL, WEBHOOK_URL, NOTIFY_DESKTOP=1. The console
channel is always on. See README.md for full setup.`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }

  loadDotEnv(path.join(HERE, ".env"));
  loadDotEnv(path.join(process.cwd(), ".env"));

  const config = loadConfig(args);

  const providerName =
    config.provider || (config.vendorKey ? "amc-api" : "amc-web");
  if (providerName !== "mock" && !config.showtimeId) {
    process.stderr.write(
      "error: no showtime id. Pass --showtime <ID>, set AMC_SHOWTIME_ID, or add " +
        '"showtimeId" to config.json.\n\n' +
        HELP +
        "\n",
    );
    process.exitCode = 1;
    return;
  }

  const provider = createProvider(config);
  const notifiers = buildNotifiers(config);
  const stateKey = `${provider.name}:${config.showtimeId ?? "mock"}`;

  log(
    `AMC seat bot starting — provider=${provider.name} ` +
      `showtime=${config.showtimeId ?? "(mock)"} ` +
      `interval=${config.intervalSeconds}s ` +
      `channels=[${notifiers.map((n) => n.name).join(", ")}]`,
  );
  if (config.intervalSeconds < 15 && !config.once) {
    log(
      "⚠️  interval < 15s: polling this aggressively may get you rate-limited or " +
        "blocked by AMC, and may violate their terms. Consider 30–60s.",
    );
  }

  const doCheck = async () => {
    try {
      await runCheck({ provider, notifiers, config, stateKey });
      return true;
    } catch (err) {
      log(`check failed: ${err.message}`);
      return false;
    }
  };

  if (config.once) {
    const ok = await doCheck();
    process.exitCode = ok ? 0 : 1;
    return;
  }

  let running = true;
  const stop = () => {
    if (!running) return;
    running = false;
    log("shutting down.");
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  let consecutiveFailures = 0;
  while (running) {
    const ok = await doCheck();
    consecutiveFailures = ok ? 0 : consecutiveFailures + 1;

    // Exponential backoff on repeated failures, capped at 10 minutes.
    const base = config.intervalSeconds * 1000;
    const backoff =
      consecutiveFailures > 0
        ? Math.min(base * 2 ** consecutiveFailures, 10 * 60 * 1000)
        : base;
    const jitter = Math.floor(Math.random() * (config.jitterSeconds * 1000));
    const waitMs = backoff + jitter;
    if (consecutiveFailures > 0) {
      log(`retry in ${Math.round(waitMs / 1000)}s (failure #${consecutiveFailures}).`);
    }
    await sleep(waitMs);
  }
}

main().catch((err) => {
  process.stderr.write(`fatal: ${err.stack ?? err.message}\n`);
  process.exit(1);
});
