import express from "express";
import {
  registerUser,
  loginUser,
  registerPendaftar,
  loginPendaftar,
  telegramWebhook,
} from "../controllers/AuthController.js";
import {
  getJadwalUjian,
  getKartuUjian,
  getProfile,
  getStatus,
  updateProfile,
  getAllPendaftar,
  getPendaftarById,
  checkKelulusan,
} from "../controllers/PendaftarController.js";
import {
  createJadwal,
  createProdi,
  createRuangan,
  deleteJadwal,
  deleteProdi,
  deleteRuangan,
  getJadwal,
  getProdi,
  getRuangan,
  updateJadwal,
  updateProdi,
  updateRuangan,
} from "../controllers/AdminController.js";
import {
  inputNilai,
  verifikasiDokumen,
  getYudisium,
} from "../controllers/StaffController.js";
import { uploadDokumen } from "../controllers/UploadController.js.js";
import {
  verifyToken,
  adminOnly,
  staffOnly,
  pendaftarOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => res.send("200 ok"));

// TEST
router.get("/", (req, res) => res.send("200 ok"));

// AUTH
router.post("/auth/admin/register", registerUser);
router.post("/auth/admin/login", loginUser);
router.post("/auth/pendaftar/register", registerPendaftar);
router.post("/auth/pendaftar/login", loginPendaftar);
router.post("/auth/pendaftar/telegram-webhook", telegramWebhook);

// PENDAFTAR
router.get("/pendaftar/profile", verifyToken, pendaftarOnly, getProfile);
router.patch("/pendaftar/profile", verifyToken, pendaftarOnly, updateProfile);
router.post("/pendaftar/dokumen", verifyToken, pendaftarOnly, uploadDokumen);
router.get("/pendaftar/jadwal", verifyToken, getJadwalUjian);
router.get("/pendaftar/kartu-ujian", verifyToken, getKartuUjian);
router.get("/pendaftar/status", verifyToken, getStatus);

// GLOBAL (ADMIN & STAFF)
router.get("/pendaftar", verifyToken, getAllPendaftar);
router.get("/pendaftar/:nomor_pendaftaran", verifyToken, getPendaftarById);
router.post("/check-kelulusan", checkKelulusan);

// ADMIN
router.post("/admin/prodi", verifyToken, adminOnly, createProdi);
router.get("/admin/prodi", verifyToken, getProdi);
router.put("/admin/prodi/:id", verifyToken, adminOnly, updateProdi);
router.delete("/admin/prodi/:id", verifyToken, adminOnly, deleteProdi);

router.post("/admin/ruangan", verifyToken, adminOnly, createRuangan);
router.get("/admin/ruangan", verifyToken, adminOnly, getRuangan);
router.put("/admin/ruangan/:id", verifyToken, adminOnly, updateRuangan);
router.delete("/admin/ruangan/:id", verifyToken, adminOnly, deleteRuangan);

router.post("/admin/jadwal", verifyToken, adminOnly, createJadwal);
router.get("/admin/jadwal", verifyToken, getJadwal);
router.put("/admin/jadwal/:id", verifyToken, adminOnly, updateJadwal);
router.delete("/admin/jadwal/:id", verifyToken, adminOnly, deleteJadwal);

// STAFF
router.put(
  "/staff/verifikasi-dokumen/:nomor_pendaftaran",
  verifyToken,
  staffOnly,
  verifikasiDokumen,
);
router.post("/staff/nilai", verifyToken, staffOnly, inputNilai);
router.get("/staff/yudisium", verifyToken, staffOnly, getYudisium);

export default router;
