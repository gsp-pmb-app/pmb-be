import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const JadwalUjian = db.define(
  "jadwal_ujian",
  {
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sesi: {
      type: DataTypes.ENUM("pagi", "siang"),
      allowNull: false,
    },
    kuota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ruanganId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prodiId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default JadwalUjian;
