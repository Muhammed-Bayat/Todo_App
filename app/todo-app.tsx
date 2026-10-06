"use client";

import { FormEvent, useEffect, useState } from "react";
import { STATUSES, type SortKey, type Task, type TaskInput, type TaskStatus } from "../lib/tasks";

const emptyTask: TaskInput = {
  title: "",
  description: "",
  dueDate: "",
  topic: "",
  status: "Todo",
};

function isOverdue(task: Task): boolean {
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return task.status !== "Complete" && task.dueDate < localToday;
}

export function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskInput>(emptyTask);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [sort, setSort] = useState<SortKey>("dueDate");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadTasks() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/tasks?archived=${showArchived}&sort=${sort}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load tasks.");
      setTasks(await response.json() as Task[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, [showArchived, sort]);

  function updateField<K extends keyof TaskInput>(field: K, value: TaskInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const method = editingId === null ? "POST" : "PUT";
    const url = editingId === null ? "/api/tasks" : `/api/tasks/${editingId}`;
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json() as Task | { error: string };
      if (!response.ok) throw new Error("error" in body ? body.error : "Could not save task.");
      setForm(emptyTask);
      setEditingId(null);
      setMessage(method === "POST" ? "Task created." : "Task updated.");
      await loadTasks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save task.");
    }
  }

  function edit(task: Task) {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, dueDate: task.dueDate, topic: task.topic, status: task.status });
    setMessage(`Editing “${task.title}”.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyTask);
    setMessage("");
  }

  async function archive(id: number) {
    setMessage("");
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "PATCH" });
      const body = await response.json() as Task | { error: string };
      if (!response.ok) throw new Error("error" in body ? body.error : "Could not archive task.");
      setMessage("Task archived. It remains available in Archived tasks.");
      await loadTasks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not archive task.");
    }
  }

  return (
    <main>
      <header className="masthead">
        <p className="eyebrow">Local-first task manager</p>
        <h1>Todo</h1>
        <p className="intro">Your tasks are stored in SQLite on this machine.</p>
      </header>

      <section className="task-form" aria-labelledby="form-heading">
        <h2 id="form-heading">{editingId === null ? "Create a task" : "Edit task"}</h2>
        <form onSubmit={submit}>
          <label>
            Title
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} required rows={3} />
          </label>
          <div className="form-row">
            <label>
              Due date
              <input type="date" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} required />
            </label>
            <label>
              Topic
              <input value={form.topic} onChange={(event) => updateField("topic", event.target.value)} required />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => updateField("status", event.target.value as TaskStatus)}>
                {STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <div className="actions">
            <button type="submit">{editingId === null ? "Create task" : "Save changes"}</button>
            {editingId !== null && <button className="secondary" type="button" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="task-list" aria-labelledby="tasks-heading">
        <div className="list-heading">
          <div>
            <p className="eyebrow">{showArchived ? "Preserved records" : "Current work"}</p>
            <h2 id="tasks-heading">{showArchived ? "Archived tasks" : "Active tasks"}</h2>
          </div>
          <div className="controls">
            <label>
              Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                <option value="dueDate">Due date</option>
                <option value="topic">Topic</option>
                <option value="status">Status</option>
              </select>
            </label>
            <button className="secondary" type="button" onClick={() => setShowArchived((current) => !current)}>
              {showArchived ? "Show active" : "Show archived"}
            </button>
          </div>
        </div>

        {message && <p className="message" role="status">{message}</p>}
        {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? <p className="empty">{showArchived ? "No archived tasks yet." : "No active tasks yet. Create your first task above."}</p> : (
          <ul className="tasks">
            {tasks.map((task) => (
              <li className="task" key={task.id}>
                <div className="task-main">
                  <div className="task-title-row">
                    <h3>{task.title}</h3>
                    {isOverdue(task) && <span className="overdue">Overdue</span>}
                  </div>
                  <p>{task.description}</p>
                  <dl>
                    <div><dt>Due</dt><dd>{task.dueDate}</dd></div>
                    <div><dt>Topic</dt><dd>{task.topic}</dd></div>
                    <div><dt>Status</dt><dd>{task.status}</dd></div>
                  </dl>
                </div>
                {!showArchived && <div className="task-actions">
                  <button className="secondary" type="button" onClick={() => edit(task)}>Edit</button>
                  <button className="archive" type="button" onClick={() => archive(task.id)}>Archive</button>
                </div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
