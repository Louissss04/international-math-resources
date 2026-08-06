import { pbkdf2Sync, randomBytes } from "node:crypto";

const ITERATIONS = 750_000;

function readHidden(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    return new Promise((resolve) => {
      process.stderr.write(prompt);
      let value = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => { value += chunk; });
      process.stdin.on("end", () => resolve(value.trimEnd()));
    });
  }

  return new Promise((resolve, reject) => {
    let value = "";
    process.stderr.write(prompt);
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("data", onData);
    };
    const onData = (chunk) => {
      for (const character of chunk) {
        if (character === "\u0003") {
          cleanup();
          process.stderr.write("\n");
          reject(new Error("Cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          cleanup();
          process.stderr.write("\n");
          resolve(value);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= " ") value += character;
      }
    };
    process.stdin.on("data", onData);
  });
}

try {
  const password = await readHidden("管理员密码：");
  if (password.length < 14 || password.length > 200) {
    throw new Error("密码长度须为 14—200 个字符。");
  }
  if (process.stdin.isTTY) {
    const confirmation = await readHidden("再次输入：");
    if (password !== confirmation) throw new Error("两次输入不一致。");
  }

  const salt = randomBytes(24);
  const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  process.stdout.write(
    `pbkdf2-sha256$${ITERATIONS}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}\n`,
  );
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : "生成失败。"}\n`);
  process.exitCode = 1;
}
