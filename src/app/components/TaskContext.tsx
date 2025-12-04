"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: number;
  title: string;
  description: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};
