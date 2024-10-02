const { Router } = require('express');   
const router = Router();
const authorization = require("../middlewares/authorization");
const { getUser, addToCart, removeFromCart, addToWishlist, removeFromWishlist, updateQty, getUsers,
  getCartDetailsByUserId, updateUserProfile,updateUserStatus,getWishLists,updateUser
} = require('../controllers/userController');
const { upload } = require('../middlewares/multer');

router.get('/getAllUsers', getUsers);
router.put('/update-status', updateUserStatus);
router.use(authorization)
router.get('/', getUser);
router.post('/',upload.single('profile'),updateUser);
router.patch('/userDetails', updateUserProfile);
router.patch('/updateQty', updateQty);    
router.patch('/addToCart/:id', addToCart);
router.patch('/removeFromCart/:id', removeFromCart);
router.patch('/addToWishlist/:id', addToWishlist);
router.patch('/removeFromWishlist/:id', removeFromWishlist);
router.get('/getwishlist',authorization, getWishLists);
router.get('/getcarts', authorization, getCartDetailsByUserId);


module.exports = router;
