const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../../uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 100000)}.jpg`);
  },
});

const upload = multer({ storage });

exports.singleUpload = upload.single('image');
exports.multipleUpload = upload.array('images', 10);

