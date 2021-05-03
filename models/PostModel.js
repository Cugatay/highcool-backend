const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user_id: String,
    content: String,
    likes: Array,
    dislikes: Array,
    comments: Array,
  },
  { timestamps: true },
);

const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel;
