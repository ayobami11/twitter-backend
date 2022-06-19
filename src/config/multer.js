const multer = require('multer');

const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'twitter'
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // reject file
        cb({ message: 'Unsupported file format' }, false);
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 ** 2 },
    fileFilter
})

module.exports = upload;