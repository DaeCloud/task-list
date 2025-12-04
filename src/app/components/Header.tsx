"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Editor } from "@tinymce/tinymce-react";
// import { useTasks } from "./TaskContext";

export default function Header() {
//   const { addTask } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tinymceApiKey, setTinymceApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await fetch("/api/tinymce");
        const key = await res.text();
        setTinymceApiKey(key);
      } catch (err) {
        console.error("Failed to fetch TinyMCE API key", err);
      }
    };

    fetchApiKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create task");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top bar */}
      <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Task App</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Create Task
        </button>
      </header>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-60" />
          <div className="bg-gray-800 rounded max-w-2xl w-full p-6 z-10 text-white shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4">Create Task</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Editor
                  apiKey={tinymceApiKey || process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={description}
                  onEditorChange={(content) => setDescription(content)}
                  init={{
                    height: 250,
                    menubar: true,
                    plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'],
                    toolbar: null,
                    skin: "oxide-dark",
                    content_css: "dark",
                    branding: false,
                  }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}

