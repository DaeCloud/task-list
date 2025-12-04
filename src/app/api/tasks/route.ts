// app/api/tasks/route.ts
import { query } from "../db";

export async function GET() {
  const tasks = await query("SELECT * FROM tasks");

  return Response.json(tasks);
}
