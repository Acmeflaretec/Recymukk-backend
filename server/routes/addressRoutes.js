const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getAddress, addAddress, updateAddress, deleteAddress,setPrimaryAddress } = require('../controllers/addressController');

router.get('/',authorization, getAddress);
router.post('/',authorization, addAddress);
router.patch('/',authorization, updateAddress);
router.delete('/:id', authorization, deleteAddress);
router.patch('/setprimary',authorization, setPrimaryAddress);

module.exports = router;
