import multer from 'multer';
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  const uploadPath = path.resolve('C:/Users/King/Desktop/fasih proj/src/books');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  cb(null, uploadPath);
},
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('فقط ملفات PDF مسموح بها'), false);
  }
};

export const uploadBook = multer({ storage, fileFilter });
