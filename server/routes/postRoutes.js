const router = require('express').Router();
const {
  getAllPosts, getPostBySlug, createPost,
  updatePost, deletePost, getMyPosts, getPostForEdit,
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const { validatePost } = require('../middleware/validate');

router.get('/', getAllPosts);
router.get('/mine', auth, getMyPosts);
router.get('/edit/:id', auth, getPostForEdit);
router.get('/:slug', getPostBySlug);
router.post('/', auth, validatePost, createPost);
router.put('/:id', auth, validatePost, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
