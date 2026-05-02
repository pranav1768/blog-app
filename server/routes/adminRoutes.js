const router = require('express').Router();
const {
  getAllUsers, updateUserRole, deleteUser,
  getAllPostsAdmin, getDashboardStats,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleGuard');

router.use(auth, requireRole('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/posts', getAllPostsAdmin);

module.exports = router;
