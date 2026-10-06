import { NextRequest, NextResponse } from "next/server";
import { createTask, isTaskInput, listTasks } from "../../../lib/db";
import type { SortKey } from "../../../lib/tasks";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const archived = request.nextUrl.searchParams.get("archived") === "true";
  const requestedSort = request.nextUrl.searchParams.get("sort");
  const sort: SortKey = requestedSort === "topic" || requestedSort === "status" ? requestedSort : "dueDate";
  return NextResponse.json(listTasks(archived, sort));
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  if (!isTaskInput(body)) {
    return NextResponse.json({ error: "Title, description, due date, topic, and a valid status are required." }, { status: 400 });
  }
  return NextResponse.json(createTask(body), { status: 201 });
}
