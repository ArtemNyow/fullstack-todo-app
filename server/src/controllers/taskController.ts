import { Response } from "express";
import { Task } from "../models/index.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description: description ?? null,
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

    const where: {
      userId: number;
      status?: "todo" | "in progress" | "done";
    } = {
      userId: req.user.userId,
    };

    if (status === "todo" || status === "in progress" || status === "done") {
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

    const task = await Task.findOne({
      where: {
        id: Number(req.params.id),
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

    const task = await Task.findOne({
      where: {
        id: Number(req.params.id),
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
      if (status !== "todo" && status !== "in progress" && status !== "done") {
        res.status(400).json({
          message: "Invalid task status",
        });
        return;
      }

      task.status = status;
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
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

    const task = await Task.findOne({
      where: {
        id: Number(req.params.id),
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
