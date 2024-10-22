const express = require('express');
const { createReview, getReviewsByProductId, getAdminReview,
    updateReview,
    deleteReviewById,
    getReviewById } = require('../controllers/reviewController');
const { upload } = require('../middlewares/multer');


const router = express.Router();
console.log('sfdafd'); 
router.post('/',upload.array('images', 10), createReview);
router.get('/admin', getAdminReview)
router.get('/:productId', getReviewsByProductId);
router.patch('/', upload.single('image'), updateReview)
router.delete('/:id', deleteReviewById)
router.get('/admin/:id', getReviewById)

module.exports = router;
