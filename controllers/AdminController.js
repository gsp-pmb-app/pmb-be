import { Op } from "sequelize";

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

// READ
export const getRuangan = async (req, res) => {
  try {
    const data = await Ruangan.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
export const updateRuangan = async (req, res) => {
  try {
    const { id } = req.params;

    await Ruangan.update(req.body, {
      where: { id },
    });

    res.json({ msg: "Ruangan berhasil diupdate!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
export const deleteRuangan = async (req, res) => {
  try {
    const { id } = req.params;

    await Ruangan.destroy({
      where: { id },
    });

    res.json({ msg: "Ruangan berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END RUANGAN ================== */

/* ================== START JADWAL ================== */

// CREATE
export const createJadwal = async (req, res) => {
  try {
    const { tanggal, sesi, ruanganId, kuota } = req.body;

    const existing = await JadwalUjian.findOne({
      where: { tanggal, sesi, ruanganId },
    });

    // VALIDASI RUANGAN
    if (existing) {
      return res.status(400).json({
        msg: "Ruangan sudah dipakai pada tanggal & sesi tersebut",
      });
    }

    if (ruanganId) {
      const ruangan = await Ruangan.findByPk(ruanganId);

      if (!ruangan)
        return res.status(404).json({ msg: "Ruangan tidak ditemukan" });

      if (Number(kuota) > ruangan.kapasitas) {
        return res.status(400).json({
          msg: `Kuota (${kuota}) melebihi kapasitas ruangan (${ruangan.kapasitas})`,
        });
      }
    }

    const jadwal = await JadwalUjian.create(req.body);

    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// READ
export const getJadwal = async (req, res) => {
  try {
    const data = await JadwalUjian.findAll({
      include: [{ model: Ruangan }, { model: Prodi }],
      order: [["tanggal", "ASC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
export const updateJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const { kuota, tanggal, sesi, ruanganId } = req.body;

    const existing = await JadwalUjian.findOne({
      where: {
        tanggal,
        sesi,
        ruanganId,
        id: { [Op.ne]: id },
      },
    });

    if (existing) {
      return res.status(400).json({
        msg: "Ruangan sudah dipakai pada tanggal & sesi tersebut",
      });
    }

    if (ruanganId) {
      const ruangan = await Ruangan.findByPk(ruanganId);

      if (!ruangan)
        return res.status(404).json({ msg: "Ruangan tidak ditemukan" });

      if (Number(kuota) > ruangan.kapasitas) {
        return res.status(400).json({
          msg: `Kuota (${kuota}) melebihi kapasitas ruangan (${ruangan.kapasitas})`,
        });
      }
    }

    await JadwalUjian.update(req.body, { where: { id } });

    res.json({ msg: "Jadwal ujian berhasil diupdate!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
export const deleteJadwal = async (req, res) => {
  try {
    await JadwalUjian.destroy({
      where: { id: req.params.id },
    });

    res.json({ msg: "Jadwal ujian berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END JADWAL ================== */
