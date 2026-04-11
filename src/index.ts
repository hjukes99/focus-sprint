import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type SessionStatus = "active" | "complete" | "abandoned";

type Session = {
  id: string;
  startedAt: string;
  endedAt?: string;
  minutes: number;
  status: SessionStatus;
};

type Db = { sessions: Session[] };

const DB_PATH = resolve(process.cwd(), "data/sessions.json");

function ensureDb(): Db {
  if (!existsSync(DB_PATH)) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    const empty: Db = { sessions: [] };
    writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(readFileSync(DB_PATH, "utf8")) as Db;
}

function saveDb(db: Db) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const command = process.argv[2];
const db = ensureDb();

if (command === "start") {
  const minutesRaw = arg("--minutes") ?? "25";
  const minutes = Number(minutesRaw);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    console.error("Invalid --minutes value");
    process.exit(1);
  }
  const active = db.sessions.find((s) => s.status === "active");
  if (active) {
    console.error("An active session already exists.");
    process.exit(1);
  }
  const session: Session = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    minutes,
    status: "active"
  };
  db.sessions.push(session);
  saveDb(db);
  console.log(`Started session ${session.id} for ${minutes} minutes.`);
  process.exit(0);
}

if (command === "end") {
  const status = (arg("--status") ?? "complete") as SessionStatus;
  if (status !== "complete" && status !== "abandoned") {
    console.error("--status must be complete or abandoned");
    process.exit(1);
  }
  const active = db.sessions.find((s) => s.status === "active");
  if (!active) {
    console.error("No active session to end.");
    process.exit(1);
  }
  active.status = status;
  active.endedAt = new Date().toISOString();
  saveDb(db);
  console.log(`Ended session ${active.id} as ${status}.`);
  process.exit(0);
}

if (command === "summary" && arg("--today") !== undefined) {
  const day = todayKey();
  const completed = db.sessions.filter(
    (s) => s.status === "complete" && s.startedAt.startsWith(day)
  );
  const totalMinutes = completed.reduce((sum, s) => sum + s.minutes, 0);
  console.log(
    JSON.stringify(
      {
        date: day,
        completedSessions: completed.length,
        totalMinutes
      },
      null,
      2
    )
  );
  process.exit(0);
}

console.log(`Usage:
  start [--minutes 25]
  end [--status complete|abandoned]
  summary --today`);
