import express from "express";
import sequelize from "./config/database.js";
import "./models/index.js";

const app = express();

const PORT = 5000;

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
