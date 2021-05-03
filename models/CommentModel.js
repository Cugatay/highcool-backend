const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    user_id: String,
    post_id: Schema.Types.ObjectId,
    content: String,
    likes: Array,
    dislikes: Array,
  },
  { timestamps: true },
);

const CommentModel = mongoose.model('comment', CommentSchema);

module.exports = CommentModel;
