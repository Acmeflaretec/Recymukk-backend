const { Router } = require('express');
const router = Router();
const { getTags, addTag, updateTag, deleteTag, getTagById } = require('../controllers/tagController');
const { upload } = require('../middlewares/multer');

router.get('/', getTags);
router.get('/:id', getTagById);
router.post('/', upload.single('image'), addTag);
router.patch('/', upload.single('image'), updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
