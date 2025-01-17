const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck');
const { listUser , listOrder , changeStatusOrder } = require('../controllers/admin');

router.put('/admin/status-order/:id' , authCheck , adminCheck , changeStatusOrder);
router.get('/admin/list-orders' , authCheck , adminCheck , listOrder );
router.get('/admin/list-users' , authCheck , adminCheck , listUser );

module.exports = router;