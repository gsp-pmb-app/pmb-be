import Pendaftar from "../models/PendaftarModel.js";
import Prodi from "../models/ProdiModel.js";
import JadwalUjian from "../models/JadwalUjianModel.js";
import Ruangan from "../models/RuanganModel.js";

/* ================== START PENDAFTAR ================== */

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findByPk(req.user.pendaftarId);

    if (!pendaftar) {
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });
    }

    res.json(pendaftar);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findByPk(req.user.pendaftarId);

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    const {
      pendidikan_institusi,
      pendidikan_jurusan,
      pendidikan_jenjang,
      tahun_lulus,
      jadwalUjianId,
      prodiId,
      status,
      tanggal_lahir,
    } = req.body;

    await pendaftar.update({
      pendidikan_institusi,
      pendidikan_jurusan,
      pendidikan_jenjang,
      tahun_lulus,
      jadwalUjianId,
      prodiId,
      status,
      tanggal_lahir,
    });

    res.json({ msg: "Pendaftaran berhasil" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET JADWAL UJIAN
export const getJadwalUjian = async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findByPk(req.user.pendaftarId, {
      include: [
        { model: Prodi, as: "prodiData" },
        {
          model: JadwalUjian,
          include: [Ruangan],
        },
      ],
    });

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    res.json({
      jenjang: pendaftar.pendidikan_jenjang,
      prodi: pendaftar.prodiData?.nama_prodi,
      tanggal: pendaftar.JadwalUjian?.tanggal,
      sesi: pendaftar.JadwalUjian?.sesi,
      ruangan: pendaftar.JadwalUjian?.Ruangan?.nama_ruangan,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET KARTU UJIAN
export const getKartuUjian = async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findByPk(req.user.pendaftarId, {
      attributes: [
        "id",
        "nama_lengkap",
        "nomor_pendaftaran",
        "pendidikan_jenjang",
        "foto_path",
        "status",
      ],
      include: [
        {
          model: Prodi,
          as: "prodiData",
          attributes: ["id", "nama_prodi"],
        },
        {
          model: JadwalUjian,
          attributes: ["id", "tanggal", "sesi", "kuota", "ruanganId"],
          include: [
            {
              model: Ruangan,
              attributes: ["id", "nama_ruangan"],
            },
          ],
        },
      ],
    });

    if (!pendaftar) {
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });
    }

    res.json({
      nama: pendaftar.nama_lengkap,
      nomor_pendaftaran: pendaftar.nomor_pendaftaran,
      jenjang: pendaftar.pendidikan_jenjang,
      foto: pendaftar.foto_path,
      prodi: pendaftar.prodiData || null,
      jadwal: pendaftar.JadwalUjian
        ? {
            ...pendaftar.JadwalUjian.toJSON(),
            ruangan: pendaftar.JadwalUjian.Ruangan || null,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET STATUS KELULUSAN
export const getStatus = async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findByPk(req.user.pendaftarId);

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    res.json({
      status: pendaftar.status,
      jenjang: pendaftar.pendidikan_jenjang,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END PENDAFTAR ================== */

/* ================== START DATA PENDAFTAR ================== */
// GET ALL PENDAFTAR -> STAFF & ADMIN
export const getAllPendaftar = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const prodiId = Number(req.query.prodiId);

    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.prodiId) {
      where.id = Number(req.query.prodiId);
    }

    const { rows, count } = await Pendaftar.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["kode_akses", "telegram_token", "telegram_chat_id"],
      },
    });

    res.json({
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET PENDAFTAR BY ID
export const getPendaftarById = async (req, res) => {
  try {
    const { nomor_pendaftaran } = req.params;

    const pendaftar = await Pendaftar.findOne({
      where: { nomor_pendaftaran },
      attributes: {
        exclude: ["kode_akses", "telegram_token", "telegram_chat_id"],
      },
      include: [
        {
          model: Prodi,
          as: "prodiData",
          attributes: ["id", "nama_prodi"],
        },
        {
          model: JadwalUjian,
          include: [Ruangan],
        },
      ],
    });

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    res.json(pendaftar);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END DATA PENDAFTAR ================== */

export const checkKelulusan = async (req, res) => {
  try {
    const { nomor_pendaftaran, tanggal_lahir } = req.body;

    if (!nomor_pendaftaran || !tanggal_lahir) {
      return res.status(400).json({ msg: "Data tidak lengkap" });
    }

    const pendaftar = await Pendaftar.findOne({
      where: {
        nomor_pendaftaran,
        tanggal_lahir,
      },
      attributes: [
        "nama_lengkap",
        "nomor_pendaftaran",
        "tanggal_lahir",
        "status",
        "pendidikan_jenjang",
      ],
      include: [
        {
          model: Prodi,
          as: "prodiData",
          attributes: ["nama_prodi"],
        },
      ],
    });

    if (!pendaftar) {
      return res.status(404).json({
        msg: "Data tidak ditemukan. Periksa kembali nomor dan tanggal lahir.",
      });
    }

    res.json({
      nama: pendaftar.nama_lengkap,
      nomor_pendaftaran: pendaftar.nomor_pendaftaran,
      tanggal_lahir: pendaftar.tanggal_lahir,
      status: pendaftar.status,
      jenjang: pendaftar.pendidikan_jenjang,
      prodi: pendaftar.prodiData?.nama_prodi,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
