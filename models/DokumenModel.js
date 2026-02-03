import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Dokumen = db.define(
  "dokumen",
  {
    pendaftarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jenis_dokumen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_verifikasi: {
      type: DataTypes.ENUM("pending", "valid", "invalid"),
      defaultValue: "pending",
    },
    catatan: DataTypes.TEXT,
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Dokumen;
