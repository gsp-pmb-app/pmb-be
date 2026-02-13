import { Op } from "sequelize";
import cloudinary from "../helpers/cloudinary.js";
import path from "path";
import Pendaftar from "../models/PendaftarModel.js";
import Nilai from "../models/NilaiModel.js";
import Prodi from "../models/ProdiModel.js";

/* ================== START VERIFIKASI DOKUMEN ================== */

export const verifikasiDokumen = async (req, res) => {
  try {
    const { nomor_pendaftaran } = req.params;
    const { status } = req.body;

    if (!["verifikasi", "ditolak"].includes(status)) {
      return res.status(400).json({ msg: "Status tidak valid" });
    }

    const pendaftar = await Pendaftar.findOne({
      where: { nomor_pendaftaran },
    });

    if (!pendaftar) {
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });
    }

    await pendaftar.update({ status });

    res.json({
      msg: "Status berhasil diperbarui",
      data: {
        nomor_pendaftaran: pendaftar.nomor_pendaftaran,
        status: pendaftar.status,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END VERIFIKASI DOKUMEN ================== */

/* ================== START INPUT NILAI ================== */

export const inputNilai = async (req, res) => {
  try {
    const { nomor_pendaftaran, nilai } = req.body;

    if (!nomor_pendaftaran || nilai === undefined) {
      return res.status(400).json({ msg: "Data tidak lengkap" });
    }

    // cari pendaftar
    const pendaftar = await Pendaftar.findOne({
      where: { nomor_pendaftaran },
    });

    if (!pendaftar) {
      return res.status(404).json({ msg: "Pendaftar tidak ditemukan" });
    }

    const jadwalId = pendaftar.jadwalUjianId;

    if (!jadwalId) {
      return res
        .status(400)
        .json({ msg: "Pendaftar belum memiliki jadwal ujian" });
    }

    // upload file pdf
    let fileUrl = null;

    if (req.files && req.files.file) {
      const file = req.files.file;

      const ext = path.extname(file.name).toLowerCase();
      if (ext !== ".pdf") {
        return res.status(422).json({ msg: "File harus berformat PDF" });
      }

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "pmb/dokumen",
        resource_type: "raw",
        format: "pdf",
      });

      fileUrl = result.secure_url;
    }

    // simpan atau update nilai
    const existingNilai = await Nilai.findOne({
      where: {
        pendaftarId: pendaftar.id,
        jadwalId,
      },
    });

    let data;

    if (existingNilai) {
      await existingNilai.update({
        nilai,
        ...(fileUrl && { file_path: fileUrl }),
      });
      data = existingNilai;
    } else {
      data = await Nilai.create({
        pendaftarId: pendaftar.id,
        jadwalId,
        nilai,
        file_path: fileUrl,
      });
    }

    // update status lulus / tidak lulus
    const statusBaru = nilai >= 75 ? "lulus" : "tidak_lulus";

    await pendaftar.update({ status: statusBaru });

    res.json({
      msg: "Nilai dan file berhasil disimpan",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

/* ================== END INPUT NILAI ================== */

export const getYudisium = async (req, res) => {
  try {
    const { status, prodiId, jenjang } = req.query;

    const allowedStatus = ["verifikasi", "lulus", "tidak_lulus"];

    const wherePendaftar = {
      status: {
        [Op.in]: allowedStatus,
      },
    };

    if (status && allowedStatus.includes(status)) {
      wherePendaftar.status = status;
    }

    if (prodiId) {
      wherePendaftar.prodiId = prodiId;
    }

    if (jenjang) {
      wherePendaftar.pendidikan_jenjang = jenjang;
    }

    const data = await Pendaftar.findAll({
      where: wherePendaftar,
      attributes: [
        "id",
        "nomor_pendaftaran",
        "nama_lengkap",
        "pendidikan_jenjang",
        "status",
      ],
      include: [
        {
          model: Prodi,
          attributes: ["id", "nama_prodi"],
        },
        {
          model: Nilai,
          attributes: ["nilai", "file_path"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result = data.map((item) => ({
      nomor_pendaftaran: item.nomor_pendaftaran,
      nama: item.nama_lengkap,
      jenjang: item.pendidikan_jenjang,
      prodi: item.Prodi?.nama_prodi || "-",
      nilai: item.Nilai?.[0]?.nilai ?? null,
      file_path: item.Nilai?.[0]?.file_path ?? null,
      status: item.status,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
