import Pendaftar from "../models/PendaftarModel.js";
import jwt from "jsonwebtoken";

/* ================== HELPERS ================== */
const generateNomorPendaftaran = () => {
  const t = Date.now().toString();
  const rnd = Math.floor(Math.random() * 900) + 100;
  return `PMB${t.slice(-6)}${rnd}`;
};

const generateKodeAkses = () => {
  return Math.random().toString(36).slice(-6).toUpperCase();
};

const generateTelegramToken = () => {
  return "PMB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
};

const sendTelegramMessage = async (chat_id, text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chat_id) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.log("Telegram error:", err);
    return false;
  }
};

/* ================== CONTROLLER ================== */

// REGISTER
export const registerPendaftar = async (req, res) => {
  const { nama_lengkap, no_wa } = req.body;
  if (!nama_lengkap || !no_wa)
    return res.status(400).json({ msg: "nama_lengkap & no_wa required" });

  const telegram_token = generateTelegramToken();

  try {
    await Pendaftar.create({
      nama_lengkap,
      no_wa,
      telegram_token,
      status: "baru",
    });

    res.json({
      msg: "Draft pendaftar created",
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
      status: "aktif", // ubah status dari "baru" → "aktif"
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

export const loginPendaftar = async (req, res) => {
  const { nomor_pendaftaran, kode_akses } = req.body;

  const pendaftar = await Pendaftar.findOne({
    where: { nomor_pendaftaran },
  });

  if (!pendaftar)
    return res.status(404).json({ msg: "Nomor pendaftaran not found" });

  if (pendaftar.kode_akses !== kode_akses)
    return res.status(400).json({ msg: "Wrong access code" });

  const token = jwt.sign(
    { pendaftarId: pendaftar.id, role: "pendaftar" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2h" },
  );

  res.json({ accessToken: token });
};
