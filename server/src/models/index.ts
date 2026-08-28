import User from "./User.js";
import Task from "./Task.js";

User.hasMany(Task, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "userId",
});

export { User, Task };
