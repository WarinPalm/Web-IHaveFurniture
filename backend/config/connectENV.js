require("dotenv").config(); // โหลด .env

// const port = env.process.port || 8000; // กำหนด port ให้กับ server ถ้าไม่มีการกำหนดในไฟล์ .env ให้ใช้ port 8000
const config = {
    host: process.env.HOST,
    port: process.env.PORT,
    secret: process.env.SECRET,
};

module.exports = config;
