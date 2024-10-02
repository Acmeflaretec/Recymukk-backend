const { Router } = require('express');
const router = Router();
const { getBanners, addBanner, updateBanner, deleteBanner, getBannerById, getStoreBanners } = require('../controllers/bannerController');
const { upload } = require('../middlewares/multer');

router.get('/', getBanners);
router.get('/store', getStoreBanners);
router.get('/:id', getBannerById);
router.post('/', upload.single('image'), addBanner);
router.patch('/', upload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);  

module.exports = router;
