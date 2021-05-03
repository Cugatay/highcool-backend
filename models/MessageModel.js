const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender_id: Schema.Types.ObjectId,
    receiver_id: Schema.Types.ObjectId,
    content: String,
    info: Object,
  },
  { timestamps: true },
);

/*
    Info Content:
        type: String (normal, invite)
        post_id: Id
        accepted: Boolean
*/

const MessageModel = mongoose.model('message', MessageSchema);

module.exports = MessageModel;
