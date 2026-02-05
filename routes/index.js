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
} from "../controllers/PendaftarController.js";
import {
  createJadwal,
  createProdi,
  createRuangan,
  deleteProdi,
  getJadwal,
  getProdi,
  updateProdi,
} from "../controllers/AdminController.js";
import {
  inputNilai,
  setKelulusan,
  verifikasiDokumen,
} from "../controllers/StaffController.js";
import { uploadDokumen } from "../controllers/DokumenController.js";
import {
  verifyToken,
  adminOnly,
  staffOnly,
  pendaftarOnly,
  adminOrStaff,
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

// ADMIN
router.post("/admin/prodi", verifyToken, adminOnly, createProdi);
router.get("/admin/prodi", verifyToken, getProdi);
router.put("/admin/prodi/:id", verifyToken, adminOnly, updateProdi);
router.delete("/admin/prodi/:id", verifyToken, adminOnly, deleteProdi);
router.post("/admin/ruangan", verifyToken, adminOnly, createRuangan);
router.post("/admin/jadwal", verifyToken, adminOnly, createJadwal);
router.get("/admin/jadwal", verifyToken, getJadwal);

// STAFF
router.put(
  "/staff/dokumen/:id/verifikasi",
  verifyToken,
  staffOnly,
  verifikasiDokumen,
);
router.post("/staff/nilai", verifyToken, staffOnly, inputNilai);
router.put("/staff/kelulusan", verifyToken, staffOnly, setKelulusan);

export default router;
