import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { STATUSES, type SortKey, type Task, type TaskInput, type TaskStatus } from "./tasks";

const databasePath = process.env.TODO_DB_PATH
  ? path.resolve(process.env.TODO_DB_PATH)
  : path.join(process.cwd(), "data", "todo.db");
const dataDirectory = path.dirname(databasePath);
fs.mkdirSync(dataDirectory, { recursive: true });
const database = new Database(databasePath);

database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT NOT NULL,
    due_date TEXT NOT NULL CHECK (due_date GLOB '????-??-??'),
    topic TEXT NOT NULL CHECK (length(trim(topic)) > 0),
    status TEXT NOT NULL CHECK (status IN ('Todo', 'In Progress', 'Complete')) DEFAULT 'Todo',
    archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tasks_active_due_date ON tasks(archived, due_date);
  CREATE INDEX IF NOT EXISTS idx_tasks_active_topic ON tasks(archived, topic);
  CREATE INDEX IF NOT EXISTS idx_tasks_active_status ON tasks(archived, status);
`);

type TaskRow = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: TaskStatus;
  archived: number;
  created_at: string;
  updated_at: string;
};

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    topic: row.topic,
    status: row.status,
    archived: row.archived === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function now(): string {
  return new Date().toISOString();
}

export function isTaskInput(value: unknown): value is TaskInput {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.title === "string" && task.title.trim().length > 0 &&
    typeof task.description === "string" &&
    typeof task.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) &&
    typeof task.topic === "string" && task.topic.trim().length > 0 &&
    typeof task.status === "string" && STATUSES.includes(task.status as TaskStatus)
  );
}

export function listTasks(archived: boolean, sort: SortKey): Task[] {
  const orderBy: Record<SortKey, string> = {
    dueDate: "due_date ASC, id ASC",
    topic: "topic COLLATE NOCASE ASC, due_date ASC, id ASC",
    status: "CASE status WHEN 'Todo' THEN 1 WHEN 'In Progress' THEN 2 ELSE 3 END, due_date ASC, id ASC",
  };
  const rows = database
    .prepare(`SELECT * FROM tasks WHERE archived = ? ORDER BY ${orderBy[sort]}`)
    .all(archived ? 1 : 0) as TaskRow[];
  return rows.map(toTask);
}

export function createTask(input: TaskInput): Task {
  const timestamp = now();
  const result = database
    .prepare(`INSERT INTO tasks (title, description, due_date, topic, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(input.title.trim(), input.description, input.dueDate, input.topic.trim(), input.status, timestamp, timestamp);
  return getTask(Number(result.lastInsertRowid))!;
}

export function getTask(id: number): Task | undefined {
  const row = database.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as TaskRow | undefined;
  return row ? toTask(row) : undefined;
}

export function updateTask(id: number, input: TaskInput): Task | undefined {
  const result = database
    .prepare(`UPDATE tasks SET title = ?, description = ?, due_date = ?, topic = ?, status = ?, updated_at = ? WHERE id = ?`)
    .run(input.title.trim(), input.description, input.dueDate, input.topic.trim(), input.status, now(), id);
  return result.changes === 0 ? undefined : getTask(id);
}

export function archiveTask(id: number): Task | undefined {
  const result = database.prepare("UPDATE tasks SET archived = 1, updated_at = ? WHERE id = ?").run(now(), id);
  return result.changes === 0 ? undefined : getTask(id);
}
