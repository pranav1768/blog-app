const User = require('../models/User');
const Post = require('../models/Post');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-pwHash').sort('-createdAt');
    res.json({ users });
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-pwHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort('-createdAt')
      .select('-content');
    res.json({ posts });
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalPosts, publishedPosts, draftPosts] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ published: true }),
      Post.countDocuments({ published: false }),
    ]);
    res.json({ totalUsers, totalPosts, publishedPosts, draftPosts });
  } catch {
    res.status(500).json({ error: 'Failed to load stats' });
  }
};
 


