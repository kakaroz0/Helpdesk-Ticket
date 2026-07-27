import { spawn } from "node:child_process";

const commands = [
  ["api", "npm", ["run", "dev:backend"]],
  ["web", "npm", ["run", "dev:frontend"]]
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    shell: true,
    stdio: ["inherit", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${name}] ${chunk}`));
  child.on("exit", (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
    }
  });

  return child;
});

function shutdown() {
  children.forEach((child) => child.kill());
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
