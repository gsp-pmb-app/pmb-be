import express from "express";
import {
  registerUser,
  loginUser,
  getAllUser,
} from "../controllers/UserController.js";
import {
  registerPendaftar,
  loginPendaftar,
  telegramWebhook,
} from "../controllers/PendaftarController.js";
import {
  verifyToken,
  adminOnly,
  staffOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => res.send("Ok"));

router.get("/admin/users", verifyToken, adminOnly, getAllUser);

router.put("/staff/verifikasi/:id", verifyToken, staffOnly);

// User (admin / staff)
router.post("/auth/admin/register", registerUser);
router.post("/auth/admin/login", loginUser);

// Pendaftar
router.post("/auth/pendaftar/register", registerPendaftar);
router.post("/auth/pendaftar/login", loginPendaftar);
// Telegram webhook (set this URL in Telegram Bot webhook config)
router.post("/auth/pendaftar/telegram-webhook", telegramWebhook);

export default router;
