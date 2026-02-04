import Prodi from "../models/ProdiModel.js";
import Ruangan from "../models/RuanganModel.js";
import JadwalUjian from "../models/JadwalUjianModel.js";

/* ================== START PRODI ================== */

// CREATE
export const createProdi = async (req, res) => {
  try {
    const { nama_prodi, jenjang } = req.body;

    const prodi = await Prodi.create({ nama_prodi, jenjang });

    res.json(prodi);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// READ
export const getProdi = async (req, res) => {
  try {
    const data = await Prodi.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
export const updateProdi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_prodi, jenjang } = req.body;

    await Prodi.update({ nama_prodi, jenjang }, { where: { id } });

    res.json({ msg: "Program studi berhasil diupdate!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
export const deleteProdi = async (req, res) => {
  try {
    await Prodi.destroy({ where: { id: req.params.id } });
    res.json({ msg: "Program studi berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END PRODI ================== */

/* ================== START RUANGAN ================== */

export const createRuangan = async (req, res) => {
  try {
    const ruangan = await Ruangan.create(req.body);
    res.json(ruangan);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END RUANGAN ================== */

/* ================== START JADWAL ================== */

export const createJadwal = async (req, res) => {
  try {
    const jadwal = await JadwalUjian.create(req.body);
    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getJadwal = async (req, res) => {
  try {
    const data = await JadwalUjian.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END JADWAL ================== */
