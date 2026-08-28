"use client";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { removeToken } from "@/lib/auth";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/services/taskService";

import type { TaskStatus } from "@/types/task";

const statuses: Array<TaskStatus | "all"> = [
  "all",
  "todo",
  "in progress",
  "done",
];

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => getTasks(status === "all" ? undefined : status),
  });
  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };
  const createTaskMutation = useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      setTitle("");
      setDescription("");

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      updateTask(id, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    createTaskMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      status: "todo",
    });
  };

  return (
    <main className="todo-page">
      <div className="todo-container">
        <header className="todo-header">
          <div>
            <div className="app-logo">
              <span className="logo-icon">✓</span>

              <div>
                <h1>TaskFlow</h1>
                <p>Manage your tasks</p>
              </div>
            </div>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <section className="panel create-panel">
          <div className="section-heading">
            <h2>Create a new task</h2>
            <p>Add something you want to accomplish.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Task title</label>

              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Finish React project"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add some details about this task..."
              />
            </div>

            {createTaskMutation.isError && (
              <p className="error-message">
                Failed to create task:{" "}
                {createTaskMutation.error instanceof Error
                  ? createTaskMutation.error.message
                  : "Unknown error"}
              </p>
            )}

            <div className="form-footer">
              <span className="form-hint">New tasks start as Todo</span>

              <button
                className="primary-button create-button"
                type="submit"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? "Creating..." : "+ Create task"}
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="tasks-heading">
            <div className="section-heading">
              <h2>Your tasks</h2>
              <p>Keep track of what needs to be done.</p>
            </div>

            <span className="task-count">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          <div className="filter-list">
            {statuses.map((item) => (
              <button
                className={`filter-button ${status === item ? "active" : ""}`}
                key={item}
                type="button"
                onClick={() => setStatus(item)}
              >
                {item === "all"
                  ? "All"
                  : item === "in progress"
                    ? "In progress"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {isLoading && <div className="loading-state">Loading tasks...</div>}

          {isError && (
            <p className="error-message">
              Failed to load tasks:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          )}

          {!isLoading && !isError && (
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task above.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <article className="task-card" key={task.id}>
                    <div className="task-card-content">
                      <div className="task-card-header">
                        <h3>{task.title}</h3>

                        <span
                          className={`task-status status-${task.status.replace(
                            " ",
                            "-",
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>

                    <div className="task-actions">
                      <select
                        className="task-select"
                        value={task.status}
                        onChange={(event) =>
                          updateTaskMutation.mutate({
                            id: task.id,
                            status: event.target.value as TaskStatus,
                          })
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in progress">In progress</option>
                        <option value="done">Done</option>
                      </select>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                        disabled={deleteTaskMutation.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
