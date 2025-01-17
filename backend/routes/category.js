const express = require('express');
const router = express.Router();
const { create, getAll, editCategory, remove } = require('../controllers/category');
const { authCheck , adminCheck } = require('../middlewares/authCheck');

router.post('/category' , authCheck , adminCheck , create);
router.get('/categories' , getAll);
router.put('/edit-category/:id' , authCheck , adminCheck , editCategory);
router.delete('/category/:id' ,  authCheck , adminCheck , remove);


module.exports = router;
