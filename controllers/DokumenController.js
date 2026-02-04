import Dokumen from "../models/DokumenModel.js";
import Pendaftar from "../models/PendaftarModel.js";
import path from "path";

export const uploadDokumen = async (req, res) => {
  if (!req.files) return res.status(400).json({ msg: "No file uploaded" });

  const pendaftarId = req.user.pendaftarId;

  const { dokumen, foto } = req.files;

  try {
    // ===== PDF DOKUMEN =====
    if (dokumen) {
      const ext = path.extname(dokumen.name).toLowerCase();
      if (ext !== ".pdf")
        return res.status(422).json({ msg: "Format dokumen harus PDF" });

      const docName = `${Date.now()}-${dokumen.name}`;
      const docPath = `./public/uploads/dokumen/${docName}`;

      await dokumen.mv(docPath);

      await Dokumen.create({
        pendaftarId,
        jenis_dokumen: "dokumen_persyaratan",
        file_path: `/uploads/dokumen/${docName}`,
      });
    }

    // ===== FOTO =====
    if (foto) {
      const ext = path.extname(foto.name).toLowerCase();
      const allowed = [".jpg", ".jpeg"];

      if (!allowed.includes(ext))
        return res.status(422).json({ msg: "Format foto harus JPG/JPEG" });

      const fotoName = `${Date.now()}-${foto.name}`;
      const fotoPath = `./public/uploads/foto/${fotoName}`;

      await foto.mv(fotoPath);

      await Pendaftar.update(
        { foto_path: `/uploads/foto/${fotoName}` },
        { where: { id: pendaftarId } },
      );
    }

    res.json({ msg: "Dokumen / foto berhasil diupload" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
