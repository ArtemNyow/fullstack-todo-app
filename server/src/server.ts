import express from "express";
import sequelize from "./config/database.js";
import "./models/index.js";
import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());

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
