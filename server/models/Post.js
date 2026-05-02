const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, unique: true, index: true },
  content:   { type: String, required: true },
  excerpt:   { type: String, maxlength: 300 },
  coverImage:{ type: String, default: '' },
  tags:      [{ type: String, trim: true, lowercase: true }],
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  published: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let count = 1;
    while (await mongoose.model('Post').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${count++}`;
    }
    this.slug = slug;
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]+>/g, '').slice(0, 280);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
