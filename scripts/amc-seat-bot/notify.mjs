// Notification channels for the AMC seat bot.
//
// Every channel is optional and auto-enabled when its env vars are present,
// except `console`, which is always on. Add or tweak channels here — each is a
// small `{ name, send(message, payload) }` object, so the rest of the bot does
// not care how a notification is delivered.

import { spawn } from "node:child_process";
import process from "node:process";

const FETCH_TIMEOUT_MS = 10_000;

async function postJson(url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// Console channel: always on. Rings the terminal bell so a foregrounded
// terminal makes noise when seats open up.
function consoleChannel() {
  return {
    name: "console",
    async send(message) {
      process.stdout.write(`\x07${message}\n`);
    },
  };
}

// Desktop notification via the OS-native tool. Best effort — silently
// unavailable on headless/remote hosts.
function desktopChannel() {
  return {
    name: "desktop",
    async send(message, payload) {
      const title = payload?.title ?? "AMC seats available";
      const run = (cmd, args) =>
        new Promise((resolve) => {
          try {
            const child = spawn(cmd, args, { stdio: "ignore" });
            child.on("error", () => resolve(false));
            child.on("exit", (code) => resolve(code === 0));
          } catch {
            resolve(false);
          }
        });

      if (process.platform === "darwin") {
        const script = `display notification ${JSON.stringify(
          message,
        )} with title ${JSON.stringify(title)} sound name "Glass"`;
        await run("osascript", ["-e", script]);
      } else if (process.platform === "win32") {
        const ps = `New-BurntToastNotification -Text ${JSON.stringify(
          title,
        )}, ${JSON.stringify(message)}`;
        await run("powershell", ["-NoProfile", "-Command", ps]);
      } else {
        await run("notify-send", [title, message]);
      }
    },
  };
}

// Telegram — the easiest way to get a push to your phone. Create a bot with
// @BotFather, then message it once and read your chat id from
// https://api.telegram.org/bot<token>/getUpdates
function telegramChannel(token, chatId) {
  return {
    name: "telegram",
    async send(message) {
      await postJson(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: message,
        disable_web_page_preview: false,
      });
    },
  };
}

function discordChannel(webhookUrl) {
  return {
    name: "discord",
    async send(message) {
      await postJson(webhookUrl, { content: message });
    },
  };
}

function slackChannel(webhookUrl) {
  return {
    name: "slack",
    async send(message) {
      await postJson(webhookUrl, { text: message });
    },
  };
}

// Generic webhook: posts the full structured payload so you can wire it into
// Zapier / IFTTT / your own endpoint (e.g. to fan out to email or SMS).
function webhookChannel(webhookUrl) {
  return {
    name: "webhook",
    async send(message, payload) {
      await postJson(webhookUrl, { message, ...payload });
    },
  };
}

// Inspect config/env and assemble the enabled channels.
export function buildNotifiers(config, env = process.env) {
  const notifiers = [consoleChannel()];

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    notifiers.push(
      telegramChannel(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID),
    );
  }
  if (env.DISCORD_WEBHOOK_URL) {
    notifiers.push(discordChannel(env.DISCORD_WEBHOOK_URL));
  }
  if (env.SLACK_WEBHOOK_URL) {
    notifiers.push(slackChannel(env.SLACK_WEBHOOK_URL));
  }
  if (env.WEBHOOK_URL) {
    notifiers.push(webhookChannel(env.WEBHOOK_URL));
  }
  if (config.desktop || env.NOTIFY_DESKTOP === "1") {
    notifiers.push(desktopChannel());
  }

  return notifiers;
}

// Fire every channel; a failure in one never blocks the others.
export async function notifyAll(notifiers, message, payload = {}) {
  const results = await Promise.allSettled(
    notifiers.map((n) => n.send(message, payload)),
  );
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const name = notifiers[i]?.name ?? "unknown";
      process.stderr.write(
        `[notify] channel "${name}" failed: ${result.reason?.message ?? result.reason}\n`,
      );
    }
  });
}
