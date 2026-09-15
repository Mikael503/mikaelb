#!/usr/bin/env node
/**
 * Génère la valeur ADMIN_PASSWORD_HASH attendue par l'API de login.
 *
 * Usage :
 *   node scripts/hash-password.mjs "MonMotDePasse"
 *   (ou sans argument pour être invité à le saisir, sans écho)
 *
 * Le résultat est un base64 de JSON { hash, salt } :
 *   hash = pbkdf2(motDePasse, salt, 100000, 64, "sha512") en hex
 *   salt = 32 octets aléatoires en hex
 */
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline";
import { stdin, stdout, exit, argv } from "node:process";

const ITERATIONS = 100_000;
const HASH_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password) {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, HASH_LENGTH, DIGEST).toString("hex");
  return { hash, salt };
}

function ask(question) {
  const rl = createInterface({ input: stdin, output: stdout });
  // On désactive l'écho en patchant le writer (simple et sans dépendance)
  rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  });
  return new Promise((resolve) => {
    globalThis.__rlResolve = resolve;
  });
}
function resolve(v) {
  if (globalThis.__rlResolve) globalThis.__rlResolve(v);
}

const password = argv[2];

if (password && password.trim()) {
  const { hash, salt } = hashPassword(password.trim());
  console.log(Buffer.from(JSON.stringify({ hash, salt })).toString("base64"));
  exit(0);
}

// Pas de mot de passe en argument : on le demande sans écho si possible
if (stdin.isTTY) {
  let echoed = "";
  const originalWrite = stdout.write.bind(stdout);
  stdout.write = (chunk, ...args) => {
    const s = typeof chunk === "string" ? chunk : chunk.toString();
    if (echoed.length < 4096) echoed += s;
    return originalWrite(chunk, ...args);
  };
  // Lecture masquée caractère par caractère (Unix)
  try {
    const readline = await import("node:readline/promises");
    stdout.write("Saisissez le mot de passe admin : ");
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf-8");
    let value = "";
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        originalWrite("\n");
        finish(value);
        return;
      }
      if (ch === "\u0003") {
        originalWrite("\n");
        exit(1);
      }
      if (ch === "\u007f" || ch === "\b") {
        value = value.slice(0, -1);
        return;
      }
      value += ch;
    };
    stdin.on("data", onData);
    function finish(v) {
      stdout.write = originalWrite;
      const { hash, salt } = hashPassword(v);
      console.log(Buffer.from(JSON.stringify({ hash, salt })).toString("base64"));
      exit(0);
    }
  } catch {
    // Fallback : readline classique (écho visible)
    const rl = createInterface({ input: stdin, output: stdout });
    rl.question("Saisissez le mot de passe admin : ", (v) => {
      rl.close();
      const { hash, salt } = hashPassword(v);
      console.log(Buffer.from(JSON.stringify({ hash, salt })).toString("base64"));
      exit(0);
    });
  }
} else {
  console.error('Usage : node scripts/hash-password.mjs "MotDePasse"');
  exit(1);
}
