const shortid = require('shortid');
const { Types } = require('mongoose');

const { ObjectId } = Types;
const errors = require('../errors.json');

const tokenHelper = require('./token');

const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const Message = require('../models/MessageModel');

const NORMAL = 'normal';
const INVITE = 'invite';

const createMessage = async ({ user, receiver_username, post_id, content, message_type }) => {
  if (message_type !== NORMAL && message_type !== INVITE) {
    throw new Error(errors.message.false_type);
  }

  if (receiver_username === user._id.toString()) {
    throw new Error(errors.message.sender_and_receiver_cannot_be_same_account);
  }

  const postOrComment =
    message_type === NORMAL
      ? null
      : (await Post.findById(post_id)) || (await Comment.findById(post_id));

  if (!postOrComment) {
    throw new Error(errors.post.not_found);
  }

  if (message_type === INVITE && ObjectId.isValid(postOrComment.user_id)) {
    throw new Error(errors.message.message_not_secret);
  }

  let receiver;

  if (message_type === INVITE) {
    const secret_user_id = tokenHelper.verify(postOrComment.user_id).user_id;
    receiver = await User.findById(secret_user_id);
  } else {
    receiver = await User.findOne({ username: receiver_username });
  }

  const didSendInviteBfr = await Message.findOne({
    sender_id: user._id,
    receiver_id: receiver._id,
    'info.post_id': postOrComment._id,
  });

  if (didSendInviteBfr) {
    if (didSendInviteBfr.info.accepted) {
      throw new Error(errors.message.user_already_accepted_your_invite);
    } else {
      throw new Error(errors.message.you_already_sent_invite_for_same_post);
    }
  }

  if (receiver._id.toString() === user._id.toString()) {
    throw new Error(errors.message.sender_and_receiver_cannot_be_same_account);
  }

  let secret_code = user.message_codes.find((code) => {
    return code.user_id.toString() === receiver._id.toString();
  });

  if (!secret_code) {
    secret_code = { code: tokenHelper.generate(shortid.generate()) };

    await user.updateOne({
      $push: {
        message_codes: [{ user_id: receiver._id, code: secret_code.code }],
      },
    });

    await receiver.updateOne({
      $push: {
        message_codes: [{ user_id: user._id, code: secret_code.code }],
      },
    });
  }

  console.log('begend');
  console.log(secret_code.code);
  secret_code = tokenHelper.verify(secret_code.code);
  const newMessage = await new Message({
    sender_id: user._id,
    receiver_id: receiver._id,
    content: tokenHelper.generate(content, secret_code),
    info: {
      type: message_type,
      post_id: message_type === INVITE ? postOrComment._id : null,
      accepted: false,
      did_user_see: false,
    },
  });

  await newMessage.save((err) => {
    if (err) throw err;
  });
};

module.exports = createMessage;
