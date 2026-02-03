import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Ruangan = db.define(
  "ruangan",
  {
    nama_ruangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lokasi: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Ruangan;
