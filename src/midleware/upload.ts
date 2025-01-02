import multer from "multer";

export const uploadImg = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./public/upload/imagem");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    const extensao = ["image/png", "image/jpg", "image/jpeg"].find(
      (imgAceita) => imgAceita == file.mimetype
    );

    if (extensao) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});
