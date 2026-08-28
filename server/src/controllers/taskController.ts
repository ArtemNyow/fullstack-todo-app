import { Response } from "express";
import { Task } from "../models/index.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const taskStatuses = ["todo", "in progress", "done"] as const;
type TaskStatus = (typeof taskStatuses)[number];

const getTaskId = (value: string | string[]) => {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === "string" && taskStatuses.includes(value as TaskStatus);

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { title, description, status } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({ message: "Task title is required" });
      return;
    }

    if (status !== undefined && !isTaskStatus(status)) {
      res.status(400).json({ message: "Invalid task status" });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      status: status ?? "todo",
      userId: req.user.userId,
    });

    res.status(201).json({
      task,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({
      message,
    });
  }
};
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { status } = req.query;

    if (status !== undefined && !isTaskStatus(status)) {
      res.status(400).json({ message: "Invalid task status" });
      return;
    }

    const where: {
      userId: number;
      status?: TaskStatus;
    } = {
      userId: req.user.userId,
    };

    if (status !== undefined) {
      where.status = status;
    }

    const tasks = await Task.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      tasks,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const id = getTaskId(req.params.id);

    if (!id) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      task,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const id = getTaskId(req.params.id);

    if (!id) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    const { title, description, status } = req.body;

    if (status !== undefined) {
      if (!isTaskStatus(status)) {
        res.status(400).json({
          message: "Invalid task status",
        });
        return;
      }

      task.status = status;
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        res.status(400).json({ message: "Task title is required" });
        return;
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        res.status(400).json({ message: "Invalid task description" });
        return;
      }
      task.description =
        typeof description === "string" ? description.trim() : null;
    }

    await task.save();

    res.status(200).json({
      task,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const id = getTaskId(req.params.id);

    if (!id) {
      res.status(400).json({ message: "Invalid task id" });
      return;
    }

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    await task.destroy();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
