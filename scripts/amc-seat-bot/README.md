# 🎟️ AMC Seat Bot

Polls a single AMC showtime's seating layout on an interval and pings you the
moment seats that were taken become available again — perfect for stalking that
sold-out opening night for two seats together, or waiting on better center
seats to free up.

- **Zero dependencies.** Pure Node.js (18+; tested on 22). No `npm install`.
- **Diff-based.** Remembers which seats were open last time and only alerts on
  genuinely *new* availability — no repeat spam.
- **Notify anywhere.** Console, desktop, Telegram, Discord, Slack, or a generic
  webhook. Enable any subset.
- **Two data sources.** The official AMC API (recommended) or a best-effort
  scrape of the public seat page.

## 1. Find your showtime id

On amctheatres.com, open the movie, pick your theatre and time, and click
through to seat selection. The URL looks like:

```
https://www.amctheatres.com/showtimes/144851950/seats
                                       ^^^^^^^^^ this is your showtime id
```

## 2. Configure

Copy the examples and edit:

```bash
cd scripts/amc-seat-bot
cp .env.example .env          # secrets + settings (gitignored)
# optionally: cp config.example.json config.json
```

Settings can come from `.env`, `config.json`, or CLI flags (flags win, then env,
then the JSON file). At minimum set a **showtime id** and pick a **data source**.

### Data source

| Provider  | Needs           | Notes                                                        |
| --------- | --------------- | ------------------------------------------------------------ |
| `amc-api` | free vendor key | **Recommended.** Stable JSON. Get a key at the [AMC Developer Portal](https://developers.amctheatres.com/) — catalog/seating access is free; ticket *purchasing* is restricted, which this bot does not need. |
| `amc-web` | nothing         | Scrapes the public seat page. Fragile and may be Cloudflare-gated; use only if you can't get a key. |
| `mock`    | nothing         | Synthetic seats for testing the pipeline offline.            |

## 3. Run

```bash
# From the repo root:
node scripts/amc-seat-bot/bot.mjs --showtime 144851950

# One-shot check (for cron / CI / serverless):
node scripts/amc-seat-bot/bot.mjs --showtime 144851950 --once

# See everything:
node scripts/amc-seat-bot/bot.mjs --help
```

The first check records a **baseline** and stays quiet (so you aren't pinged
about every currently-open seat). After that, any newly-freed seat triggers a
notification. Add `--notify-first` if you *do* want an alert about seats already
open on the first run (handy when you're watching a sold-out show).

## Notifications

The **console** channel is always on (and rings the terminal bell). Enable more
by setting env vars — the bot auto-detects them:

- **Telegram** (easiest push to your phone): create a bot with
  [@BotFather](https://t.me/BotFather), send it any message, then find your chat
  id at `https://api.telegram.org/bot<token>/getUpdates`. Set `TELEGRAM_BOT_TOKEN`
  and `TELEGRAM_CHAT_ID`.
- **Discord:** Channel → Integrations → Webhooks → New Webhook. Set
  `DISCORD_WEBHOOK_URL`.
- **Slack:** an incoming webhook URL in `SLACK_WEBHOOK_URL`.
- **Generic webhook:** `WEBHOOK_URL` receives the full JSON payload — wire it to
  Zapier/IFTTT/Make to fan out to email or SMS.
- **Desktop:** `NOTIFY_DESKTOP=1` (uses `osascript` on macOS, `notify-send` on
  Linux, BurntToast on Windows).

## Running it 24/7

This is a long-lived poller. Some options:

- **Leave it running** in a terminal / `tmux` on any always-on machine.
- **systemd / launchd / pm2** to keep it alive and restart on reboot.
- **Cron with `--once`** every minute: `* * * * * cd /path/to/repo && node scripts/amc-seat-bot/bot.mjs --showtime <ID> --once >> /tmp/amc.log 2>&1`
  (state persists between runs via the state file).
- **GitHub Actions / Vercel Cron:** call `--once` on a schedule. Commit-free
  state can be kept in the runner's cache or an external store.

## Be a good citizen

The default interval is 60s with jitter. Polling more aggressively than every
~15–30s risks rate-limiting/IP blocks and may violate AMC's terms — the bot
warns you below 15s. This tool is for keeping tabs on **your own** ticket
purchase, not for scalping or hammering AMC's servers.

## Troubleshooting

- **"could not load seating layout"** — auto-discovery of the seat endpoint
  failed. Open the seat page in your browser, open DevTools → Network, reload,
  find the seating/seat-layout request, and paste its URL into
  `AMC_SEATING_LAYOUT_URL` (or `seatingLayoutUrl` in config.json).
- **Seats parse as 0 / wrong** — run with `--debug` to dump the raw payload. Seat
  extraction (`collectSeats`) in `amc.mjs` is schema-tolerant but you may need to
  tweak the field lists at the bottom of that file if AMC changed something.
- **amc-web returns nothing** — the page is likely bot-gated. Switch to `amc-api`.

## Files

| File                  | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `bot.mjs`             | CLI, config, poll loop, seat diffing, state persistence.    |
| `amc.mjs`             | Data providers + schema-tolerant seat extraction.           |
| `notify.mjs`          | Notification channels.                                       |
| `config.example.json` | Copy to `config.json`.                                       |
| `.env.example`        | Copy to `.env`.                                              |
