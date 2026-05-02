const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 9, tag, sort = '-createdAt', search } = req.query;
    const filter = { published: true };
    if (tag) filter.tags = tag;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-content'),
      Post.countDocuments(filter),
    ]);
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'name email');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, published } = req.body;
    const post = await Post.create({
      title, content, excerpt, coverImage, tags, published: published || false,
      author: req.user._id,
    });
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }
    const { title, content, excerpt, coverImage, tags, published } = req.body;
    Object.assign(post, { title, content, excerpt, coverImage, tags, published });
    await post.save();
    res.json({ post });
  } catch {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort('-createdAt')
      .select('-content');
    res.json({ posts });
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};
