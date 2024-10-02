const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { addProduct, getProducts, deleteProduct, getProductById, updateProduct,getTagProducts,getAdminProducts,getSimilrProducts,getClientProductById,addVariantProduct
 } = require('../controllers/productController');    
const { upload } = require('../middlewares/multer');

router.post('/', upload.array('images', 10), addProduct);
router.post('/variantproduct', upload.array('images', 10),addVariantProduct);
router.get('/', getProducts);   
router.get('/adminProducts', getAdminProducts);
router.get('/tagProducts', getTagProducts);
router.get('/similrProducts', getSimilrProducts);
router.delete('/:id',  deleteProduct);
router.get('/:id', getProductById);
router.get('/client/:id', getClientProductById);
// router.get('/:id/similar', getById);
router.patch('/', upload.array('images', 10), updateProduct);

module.exports = router;
