import Pendaftar from "../models/PendaftarModel.js";
import cloudinary from "../helpers/cloudinary.js";
import path from "path";

export const uploadDokumen = async (req, res) => {
  try {
    if (!req.files) return res.status(400).json({ msg: "No file uploaded" });

    const pendaftarId = req.user.pendaftarId;
    const { dokumen, foto } = req.files;

    /* ================= PDF DOKUMEN ================= */
    if (dokumen) {
      const ext = path.extname(dokumen.name).toLowerCase();
      if (ext !== ".pdf")
        return res.status(422).json({ msg: "Format dokumen harus PDF" });

      const result = await cloudinary.uploader.upload(dokumen.tempFilePath, {
        folder: "pmb/dokumen",
        resource_type: "raw", // PDF
      });

      await Pendaftar.update(
        { file_path: result.secure_url },
        { where: { id: pendaftarId } },
      );
    }

    /* ================= FOTO ================= */
    if (foto) {
      const ext = path.extname(foto.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png"].includes(ext))
        return res.status(422).json({ msg: "Format foto harus JPG/JPEG" });

      const result = await cloudinary.uploader.upload(foto.tempFilePath, {
        folder: "pmb/foto",
        resource_type: "image",
      });

      await Pendaftar.update(
        { foto_path: result.secure_url },
        { where: { id: pendaftarId } },
      );
    }

    res.json({ msg: "Dokumen / foto berhasil diupload" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
