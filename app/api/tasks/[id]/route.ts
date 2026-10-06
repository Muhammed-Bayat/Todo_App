import { NextRequest, NextResponse } from "next/server";
import { archiveTask, isTaskInput, updateTask } from "../../../../lib/db";

export const runtime = "nodejs";

function idFromRequest(request: NextRequest): number | null {
  const id = Number(request.nextUrl.pathname.split("/").pop());
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: NextRequest) {
  const id = idFromRequest(request);
  const body: unknown = await request.json().catch(() => null);
  if (!id || !isTaskInput(body)) {
    return NextResponse.json({ error: "A valid task update is required." }, { status: 400 });
  }
  const task = updateTask(id, body);
  return task ? NextResponse.json(task) : NextResponse.json({ error: "Task not found." }, { status: 404 });
}

export function PATCH(request: NextRequest) {
  const id = idFromRequest(request);
  if (!id) return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  const task = archiveTask(id);
  return task ? NextResponse.json(task) : NextResponse.json({ error: "Task not found." }, { status: 404 });
}
