import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../images'))
    },
    filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
    }
});

const imageUpload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
          req.fileValidationError = "Forbidden extension";
          return cb(null, false, req.fileValidationError);
        }
    },
}).array('uploadedImages', 5)

export default imageUpload;
