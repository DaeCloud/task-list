// app/api/task/route.ts
import { query } from "../db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
    }

    const result = await query(
      "INSERT INTO tasks (title, description) VALUES (?, ?)",
      [title, description || null]
    );

    return new Response(
      JSON.stringify({ id: (result as any).insertId, title, description }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create task" }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { id, completed } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
  }
  await query(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, id]
  );
  return new Response(JSON.stringify({ message: "Task updated" }), { status: 200 });
}