const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    posts: Array,
    comments: Array,
    followers: Array,
    following: Array,
    messages: Array,
    message_invites: Array,
    notifications: Array,
    email_verification_code: String,
    message_codes: Array,
  },
  { timestamps: true },
);

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
