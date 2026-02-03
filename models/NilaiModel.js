import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Nilai = db.define(
  "nilai",
  {
    pendaftarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jadwalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nilai: {
      type: DataTypes.FLOAT,
    },
    file_path: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Nilai;
