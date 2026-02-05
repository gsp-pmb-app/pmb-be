import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Pendaftar = db.define(
  "pendaftar",
  {
    nomor_pendaftaran: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    kode_akses: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    no_tele: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pendidikan_institusi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pendidikan_jurusan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pendidikan_jenjang: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    tahun_lulus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    prodiId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    jadwalUjianId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    foto_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    telegram_token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    telegram_chat_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    telegram_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "baru",
        "aktif",
        "verifikasi",
        "lulus",
        "tidak_lulus",
      ),
      defaultValue: "baru",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

export default Pendaftar;
