import sequelize from "../db/index.js";
import { DataTypes } from "sequelize";
import ProjectData from "./projectData.modal.js";

const nftId = sequelize.define(
  "ndtIds",
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProjectData, // Model name or table name for the projects table
        key: "id", // Key in the projects table to reference
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    nftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

nftId.sync({ force: false });
export default nftId;
