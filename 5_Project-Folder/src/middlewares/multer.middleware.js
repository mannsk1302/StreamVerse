const multer = require('multer');
const router = require("../routes/user.routes");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

module.exports = { upload };