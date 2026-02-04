import Pendaftar from "../models/PendaftarModel.js";

/* ================== START PENDAFTAR ================== */

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const pendaftar = await Pendaftar.findByPk(req.user.pendaftarId);

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

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
      prodiId,
    } = req.body;

    await pendaftar.update({
      pendidikan_institusi,
      pendidikan_jurusan,
      pendidikan_jenjang,
      tahun_lulus,
      prodiId,
      status: "lengkap",
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
        { model: Prodi },
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
      prodi: pendaftar.Prodi?.nama_prodi,
      tanggal: pendaftar.JadwalUjian?.tanggal,
      jam: pendaftar.JadwalUjian?.jam,
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
      include: [
        { model: Prodi },
        {
          model: JadwalUjian,
          include: [Ruangan],
        },
      ],
    });

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    res.json({
      nama: pendaftar.nama_lengkap,
      nomor_pendaftaran: pendaftar.nomor_pendaftaran,
      jenjang: pendaftar.pendidikan_jenjang,
      prodi: pendaftar.Prodi?.nama_prodi,
      jadwal: pendaftar.JadwalUjian
        ? `${pendaftar.JadwalUjian.tanggal} ${pendaftar.JadwalUjian.jam}`
        : null,
      ruangan: pendaftar.JadwalUjian?.Ruangan?.nama_ruangan,
      foto: pendaftar.foto_path,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET STATUS KELILISAN
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

// GET ALL PENDAFTAR
export const getAllPendaftar = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const prodiId = req.query.prodiId;

    const offset = (page - 1) * limit;

    const where = {};
    if (prodiId) where.prodiId = prodiId;

    const { rows, count } = await Pendaftar.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["kode_akses", "telegram_token"] },
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
      attributes: { exclude: ["kode_akses", "telegram_token"] },
    });

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    res.json(pendaftar);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END DATA PENDAFTAR ================== */
