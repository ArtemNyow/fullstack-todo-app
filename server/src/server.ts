import express from "express";
import sequelize from "./config/database.js";
import "./models/index.js";
import { CLIENT_URL, PORT } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: CLIENT_URL,
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/", (_req, res) => {
  res.json({
    message: "TODO API is running",
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
