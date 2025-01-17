const express = require('express');
const router = express.Router();
const { userData , editProfile } = require('../controllers/user');
const { authCheck } = require('../middlewares/authCheck');


router.get('/profile', authCheck , userData);
router.put('/edit-profile' , authCheck , editProfile)

module.exports = router;