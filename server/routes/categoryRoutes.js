const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getCategory, addCategory, deleteCategory,updateCategory,getCategoryById,getadminCategory,getHomeCategory,getCategoryName } = require('../controllers/categoryController');
const { upload } = require('../middlewares/multer');

router.get('/', getCategory);   
router.get('/categoryName', getCategoryName);   
router.get('/getHomeCategory', getHomeCategory);   
router.get('/adminCategory', getadminCategory);  
router.post("/",  upload.single('image'), addCategory);
router.get('/:id', getCategoryById);
router.patch("/",upload.single('image'),updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
