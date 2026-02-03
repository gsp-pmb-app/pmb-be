import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Pendidikan = db.define(
  "pendidikan",
  {
    pendaftarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    institusi: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    jenjang: DataTypes.STRING,
    tahun_lulus: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Pendidikan;
