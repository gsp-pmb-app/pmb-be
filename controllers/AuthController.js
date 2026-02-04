import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateKodeAkses } from "../helpers/generateKodeAkses.js";
import { generateNomorPendaftaran } from "../helpers/generateNomorPendaftaran.js";
import { generateTelegramToken } from "../helpers/generateTelegramToken.js";
import { sendTelegramMessage } from "../helpers/sendTelegramMessage.js";

/* ================== START USER (ADMIN / STAFF) ================== */

// REGISTER
export const registerUser = async (req, res) => {
  const { username, name, role, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Password tidak cocok" });

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username,
      name,
      role,
      password: hashPassword,
      is_active: true,
    });
    res.json({ msg: "Pendaftaran berhasil" });
  } catch (error) {
    res.status(400).json({ msg: "Username sudah terdaftar" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const user = await User.findOne({
    where: { username: req.body.username },
  });

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ msg: "Password salah" });

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" },
  );

  res.json({ accessToken, role: user.role });
};

/* ================== END USER (ADMIN / STAFF) ================== */

/* ================== START USER PENDAFTAR) ================== */

// REGISTER
export const registerPendaftar = async (req, res) => {
  const { nama_lengkap, no_tele } = req.body;
  if (!nama_lengkap || !no_tele)
    return res.status(400).json({ msg: "nama_lengkap & no_tele required" });

  const telegram_token = generateTelegramToken();

  try {
    await Pendaftar.create({
      nama_lengkap,
      no_tele,
      telegram_token,
      status: "baru",
    });

    res.json({
      msg: "Pendaftaran berhasil",
      telegram_token,
      telegram_url: `https://t.me/pmbgspbot?start=${telegram_token}`,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Register failed",
      error: error?.message,
      stack: error?.stack,
    });
  }
};

// TELEGRAM WEBHOOK
export const telegramWebhook = async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.text) return res.sendStatus(200);

  if (msg.text.startsWith("/start")) {
    const token = msg.text.split(" ")[1];
    if (!token) return res.sendStatus(200);

    const pendaftar = await Pendaftar.findOne({
      where: { telegram_token: token },
    });

    if (!pendaftar) {
      await sendTelegramMessage(
        msg.chat.id,
        "Token tidak valid. Silakan daftar melalui website.",
      );
      return res.sendStatus(200);
    }

    // GENERATE NOMOR PENDAFTARAN & KODE AKSES
    const nomor_pendaftaran = generateNomorPendaftaran();
    const kode_akses = generateKodeAkses();

    // UPDATE DATABASE
    await pendaftar.update({
      telegram_chat_id: msg.chat.id,
      telegram_username: msg.from.username || null,
      nomor_pendaftaran: nomor_pendaftaran,
      kode_akses: kode_akses,
      status: "aktif",
    });

    // KIRIM KE USER
    const message = `
*Pendaftaran Berhasil!*

*Nomor Pendaftaran:* *${nomor_pendaftaran}*

*Kode Akses:* *${kode_akses}*

Simpan nomor dan kode ini untuk login ke sistem PMB.
Link login: https://univexample.sch.is/pmb/login
`;

    await sendTelegramMessage(msg.chat.id, message);
  }

  res.sendStatus(200);
};

// LOGIN
export const loginPendaftar = async (req, res) => {
  const { nomor_pendaftaran, kode_akses } = req.body;

  const pendaftar = await Pendaftar.findOne({
    where: { nomor_pendaftaran },
  });

  if (!pendaftar)
    return res.status(404).json({ msg: "Nomor pendaftaran tidak ditemukan" });

  if (pendaftar.kode_akses !== kode_akses)
    return res.status(400).json({ msg: "Kode akses tidak valid" });

  const token = jwt.sign(
    { pendaftarId: pendaftar.id, role: "pendaftar" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" },
  );

  res.json({ accessToken: token });
};

/* ================== END USER PENDAFTAR) ================== */
