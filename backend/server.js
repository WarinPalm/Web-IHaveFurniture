// Step1 import ....
const express = require('express');
const app = express();
const morgan = require('morgan'); // middleware for logging request details
const { readdirSync } = require('fs'); // ใช้เรียกไฟล์ในโฟลเดอร์ได้
const path = require('path'); // ใช้เรียกใช้ path ของไฟล์
const cors = require('cors'); 
const { port } = require('./config/connectENV');  // import port from connectENV.js
// const port = process.env.PORT ; // กำหนด port ให้กับ server ถ้าไม่มีการกำหนดในไฟล์ .env ให้ใช้ port 8000



// import routers , Example 1
// const authRouter = require('./routes/auth'); // import auth router

// middleware
app.use(morgan('dev'));
app.use(express.json()); // ใช้รับ req.body จาก client ที่ส่งมาในรูปแบบ json
app.use(cors()); // ใช้เปิดให้ server รับ req จาก client จาก domain อื่นได้

// Step3 Router

// Example 1
// app.use('/api', authRouter);

// Example 2
// map คือการ loop ใน array โดยมี item เป็นแต่ละ element ใน array, item คือชื่อไฟล์
readdirSync('./routes').map((item) => app.use('/api', require(`./routes/${item}`)))


// ใช้ express.static เพื่อเปิดให้ client สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads หรือเป็นการเปิดโฟลเดอร์ uploads ให้เป็น public
app.use('/uploads/', express.static(path.join(__dirname, './uploads')));


// Step2 Start Server
app.listen(port , () => {
    console.log(`Server is running on port ${port}`); 8
})
