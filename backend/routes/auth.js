// import ....
const express = require('express');
const router = express.Router(); //สร้าง router object
const { register, login, currentUser } = require('../controllers/auth'); // import register function จาก controllers/auth.js
const { authCheck, adminCheck } = require('../middlewares/authCheck'); // import authCheck function จาก middlewares/authCheck.js

// Endpoints
router.post('/register', register)
router.post('/login', login)
router.post('/current-user', authCheck , currentUser)
router.post('/current-admin', authCheck, adminCheck, currentUser)



module.exports = router; // export router object ออกไปให้ server.js ไปใช้งานได้