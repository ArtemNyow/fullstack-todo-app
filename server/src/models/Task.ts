import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

type TaskStatus = "todo" | "in progress" | "done";

interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
}

interface TaskCreationAttributes extends Optional<
  TaskAttributes,
  "id" | "description"
> {}

class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare status: TaskStatus;
  declare userId: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("todo", "in progress", "done"),
      allowNull: false,
      defaultValue: "todo",
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: true,
  },
);

export default Task;
