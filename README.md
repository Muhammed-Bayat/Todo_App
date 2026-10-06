# Local Todo

Local-first, single-user todo application built with Next.js and SQLite.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The SQLite database is created automatically at `data/todo.db` and is retained when the application restarts. Set `TODO_DB_PATH` only when you need a different database location, for example for an isolated test run.

## Production check

```bash
npm run build
npm run start
```
