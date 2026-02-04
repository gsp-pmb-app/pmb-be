import Dokumen from "../models/DokumenModel.js";
import Nilai from "../models/NilaiModel.js";
import Pendaftar from "../models/PendaftarModel.js";

/* ================== START VERIFIKASI DOKUMEN ================== */

export const verifikasiDokumen = async (req, res) => {
  try {
    const { id } = req.params; // id dokumen
    const { status_verifikasi, catatan } = req.body;

    if (!["valid", "invalid"].includes(status_verifikasi)) {
      return res.status(400).json({ msg: "Status verifikasi tidak valid" });
    }

    const dokumen = await Dokumen.findByPk(id);

    if (!dokumen)
      return res.status(404).json({ msg: "Dokumen tidak ditemukan" });

    await dokumen.update({
      status_verifikasi,
      catatan,
    });

    res.json({ msg: "Dokumen berhasil diverifikasi" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END VERIFIKASI DOKUMEN ================== */

/* ================== START INPUT NILAI ================== */

export const inputNilai = async (req, res) => {
  try {
    const { pendaftarId, jadwalId, nilai } = req.body;

    const data = await Nilai.create({
      pendaftarId,
      jadwalId,
      nilai,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END INPUT NILAI ================== */

/* ================== START SET KELULUSAN ================== */

export const setKelulusan = async (req, res) => {
  try {
    const { pendaftarId, status } = req.body;

    if (!["lulus", "tidak_lulus"].includes(status)) {
      return res.status(400).json({ msg: "Status kelulusan tidak valid" });
    }

    const pendaftar = await Pendaftar.findByPk(pendaftarId);

    if (!pendaftar)
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });

    await pendaftar.update({ status });

    res.json({ msg: "Status kelulusan berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END SET KELULUSAN ================== */
