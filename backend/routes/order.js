const express = require('express');
const router = express.Router();
const { authCheck } = require('../middlewares/authCheck');
const { readOrder , orderPayment ,historyOrder ,cancelOrder } = require('../controllers/order');
const { uploadSlip } = require('../middlewares/upload')

router.get('/orders' , authCheck , readOrder ); // 
router.put('/payment/:id' , authCheck , uploadSlip , orderPayment);

router.get('/history' , authCheck , historyOrder );
router.put('/cancel/:id' , authCheck ,  cancelOrder);

module.exports = router;