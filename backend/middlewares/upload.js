const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตรวจสอบและสร้างโฟลเดอร์ถ้าไม่มีอยู่
const uploadDir = path.join(__dirname, '../uploads');
const uploadDirSlip = path.join(__dirname, '../uploads/slip');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // สร้างโฟลเดอร์ 'uploads' ถ้ายังไม่มี
}
if (!fs.existsSync(uploadDirSlip)) {
    fs.mkdirSync(uploadDirSlip, { recursive: true }); // สร้างโฟลเดอร์ 'uploads' ถ้ายังไม่มี
}

// ตั้งค่าที่เก็บไฟล์และการตั้งชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ที่เก็บไฟล์ (เช่นโฟลเดอร์ 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
    }
});
const storageSlip = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirSlip); // ที่เก็บไฟล์ (เช่นโฟลเดอร์ 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null,"slip" + Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
    }
});

// สร้างตัวกลางสำหรับ multer
const upload = multer({ storage: storage });
const uploadSlip = multer({ storage: storageSlip });


exports.upload = (req, res , next) => {
    // ใช้ตัวกลาง upload.single('picture') ในการอัปโหลดไฟล์
    upload.single('picture') (req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        // ตรวจสอบว่าไฟล์ถูกอัปโหลดหรือไม่
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        next();
    });
};
exports.updateImage = (req, res , next) => {
    // ใช้ตัวกลาง upload.single('picture') ในการอัปโหลดไฟล์
    upload.single('picture')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        
        next();
    });
};
exports.uploadSlip = (req, res , next) => {
    // ใช้ตัวกลาง uploadSlip.single('proofPicture') ในการอัปโหลดไฟล์
    uploadSlip.single('proofPicture')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        // ตรวจสอบว่าไฟล์ถูกอัปโหลดหรือไม่
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        next();
    });
};
