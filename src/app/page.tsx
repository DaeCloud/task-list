'use client';

import Image from "next/image";
import React, { useEffect } from "react";

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          console.error("Failed to fetch tasks");
          return;
        }
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main id="main-content" className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white sm:text-6xl">
          My tasks
        </h1>

        <div className="mt-10 w-full">
          {tasks.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">No tasks found.</p>
          ) : (
            <ul className="space-y-6">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="border-b border-gray-300 dark:border-gray-700 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    {/* Completed indicator */}
                    {task.completed ? (
                      <span
                        className="inline-block w-4 h-4 rounded-full bg-green-500 hover:cursor-pointer"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/task`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: task.id, completed: false }),
                            });
                            if (!res.ok) {
                              const data = await res.json();
                              alert(data.error || "Failed to mark task as not completed");
                              return;
                            }

                            // Update local task state
                            window.location.reload();
                          } catch (err) {
                            console.error(err);
                            alert("Error marking task as completed");
                          }
                        }}
                        />
                    ) : (
                      <span
                        className="inline-block w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-500 hover:cursor-pointer"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/task`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: task.id, completed: true }),
                            });
                            if (!res.ok) {
                              const data = await res.json();
                              alert(data.error || "Failed to mark task as completed");
                              return;
                            }

                            // Update local task state
                            window.location.reload();
                          } catch (err) {
                            console.error(err);
                            alert("Error marking task as completed");
                          }
                        }}
                      />
                    )}
                    <div>
                      <h2 className={`text-2xl font-bold mb-2 ${task.completed ? "text-zinc-500 dark:text-zinc-400 line-through" : "text-zinc-900 dark:text-white"}`}>
                        {task.title}
                      </h2>

                      {task.description && (
                        <div
                          className={`prose prose-lg dark:prose-invert !max-w-full ${task.completed ? "opacity-60 line-through" : ""}`}
                          dangerouslySetInnerHTML={{ __html: task.description }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
