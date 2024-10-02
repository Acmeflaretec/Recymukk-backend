const { Router } = require('express');
const router = Router();
const { upload } = require('../middlewares/multer');
const { getSections, getSectionById, addSection, updateSection, deleteSection, getStoreSections } = require('../controllers/storeController');

router.get('/', getSections);
router.get('/store', getStoreSections);
router.get('/:id', getSectionById);
router.post('/', upload.single('image'), addSection);
router.patch('/', upload.single('image'), updateSection);
router.delete('/:id', deleteSection);

module.exports = router;