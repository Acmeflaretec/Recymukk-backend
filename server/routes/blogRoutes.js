const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getBlogs, addBlog, updateBlog, deleteBlog, getBlogById } = require('../controllers/blogController');
const { upload } = require('../middlewares/multer');

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', upload.single('image'), addBlog);
router.patch('/', upload.single('image'), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
