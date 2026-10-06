export const STATUSES = ["Todo", "In Progress", "Complete"] as const;

export type TaskStatus = (typeof STATUSES)[number];

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status: TaskStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = Pick<Task, "title" | "description" | "dueDate" | "topic" | "status">;

export type SortKey = "dueDate" | "topic" | "status";
