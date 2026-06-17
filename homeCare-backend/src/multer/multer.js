const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadsDir = path.join(__dirname,"../../uploads")
        if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {

        const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        cb(null,randomName)
    }

})
const upload = multer({storage});
module.exports  = upload