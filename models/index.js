import Pendaftar from "./PendaftarModel.js";
import Prodi from "./ProdiModel.js";
import JadwalUjian from "./JadwalUjianModel.js";
import Ruangan from "./RuanganModel.js";
import Nilai from "./NilaiModel.js";

/* ================= RELATIONS ================= */

// Pendaftar -> Prodi
Pendaftar.belongsTo(Prodi, { foreignKey: "prodiId" });
Prodi.hasMany(Pendaftar, { foreignKey: "prodiId" });

// Pendaftar -> Jadwal
Pendaftar.belongsTo(JadwalUjian, { foreignKey: "jadwalUjianId" });
JadwalUjian.hasMany(Pendaftar, { foreignKey: "jadwalUjianId" });

// Jadwal -> Ruangan
JadwalUjian.belongsTo(Ruangan, { foreignKey: "ruanganId" });
Ruangan.hasMany(JadwalUjian, { foreignKey: "ruanganId" });

// Jadwal -> Prodi
JadwalUjian.belongsTo(Prodi, { foreignKey: "prodiId" });
Prodi.hasMany(JadwalUjian, { foreignKey: "prodiId" });

// Pendaftar -> Nilai
Pendaftar.hasOne(Nilai, { foreignKey: "pendaftarId" });
Nilai.belongsTo(Pendaftar, { foreignKey: "pendaftarId" });

export { Pendaftar, Prodi, JadwalUjian, Ruangan, Nilai };
