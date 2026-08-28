import express from "express";
import sequelize from "./config/database";
import { start } from "node:repl";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.json({
    message: "TODO API is running",
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
