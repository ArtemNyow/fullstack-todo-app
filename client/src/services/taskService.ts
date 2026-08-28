import { api } from "@/lib/api";
import type { CreateTaskData, Task, TaskStatus } from "@/types/task";

export const getTasks = async (status?: TaskStatus): Promise<Task[]> => {
  const { data } = await api.get<{ tasks: Task[] }>("/tasks", {
    params: status ? { status } : undefined,
  });

  return data.tasks;
};

export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const { data } = await api.post<{ task: Task }>("/tasks", taskData);

  return data.task;
};

export const updateTask = async (
  id: number,
  taskData: Partial<CreateTaskData>,
): Promise<Task> => {
  const { data } = await api.put<{ task: Task }>(`/tasks/${id}`, taskData);

  return data.task;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
