import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Prodi = db.define(
  "prodi",
  {
    nama_prodi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenjang: {
      type: DataTypes.ENUM("S2", "S3"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Prodi;
