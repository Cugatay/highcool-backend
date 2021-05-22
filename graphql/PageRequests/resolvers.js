/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const { Types } = require('mongoose');
const verificateUser = require('../../helpers/verificateUser');
const Message = require('../../models/MessageModel');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const Comment = require('../../models/CommentModel');

const { ObjectId } = Types;

const tokenHelper = require('../../helpers/token');
const errors = require('../../errors.json');

const resolvers = {
  Query: {
    invites: async (parent, { token }) => {
      try {
        const user = await verificateUser({ token });

        const incoming = await Message.find({
          'info.type': 'invite',
          receiver_id: user._id,
          'info.accepted': false,
        });
        const sent = await Message.find({
          'info.type': 'invite',
          sender_id: user._id,
          'info.accepted': false,
        });
        const accepted_old = await Message.find({
          'info.type': 'invite',
          sender_id: user._id,
          'info.accepted': true,
          'info.did_user_see': true,
        }).sort('-createdAt');
        const accepted_new = await Message.find({
          'info.type': 'invite',
          sender_id: user._id,
          'info.accepted': true,
          'info.did_user_see': false,
        })
          .sort('-createdAt')
          .then(async (data) => {
            if (data.length) {
              await Message.updateMany(
                {
                  _id: {
                    $in: data,
                  },
                },
                { 'info.did_user_see': true },
              );
            }
            return data;
          });

        for (let i = 0; accepted_new[i] !== undefined; i++) {
          const invite = accepted_new[i];

          const postOwner = await User.findById(invite.receiver_id);

          let secret_code = user.message_codes.find((code) => {
            return code.user_id.toString() === postOwner._id.toString();
          }).code;
          if (!secret_code) {
            throw new Error(errors.something_went_wrong);
          }
          secret_code = tokenHelper.verify(secret_code);

          const content = tokenHelper.verify(invite.content, secret_code);

          const postOrComment =
            (await Post.findById(invite.info.post_id)) ||
            (await Comment.findById(invite.info.post_id));

          // const isUserLiked = postOrComment.likes.find((like) => {
          //   return like === user.username;
          // });
          // const isUserDisliked = postOrComment.dislikes.find((dislike) => {
          //   return dislike === user.username;
          // });

          // const likes = postOrComment.likes.length;
          // const dislikes = postOrComment.dislikes.length;

          // postOrComment.likesInfo = {
          //   likesRate: likes - dislikes,
          //   isLiked: isUserLiked ? true : isUserDisliked ? false : null,
          // };

          // const count = await Comment.count({ post_id: postOrComment._id });
          // postOrComment.commentsInfo = { count };

          invite.post = postOrComment;
          invite.receiver = postOwner;
          invite.content = content;
        }

        for (let i = 0; incoming[i] !== undefined; i++) {
          const invite = incoming[i];

          const sender = await User.findById(invite.sender_id);

          let secret_code = user.message_codes.find((code) => {
            return code.user_id.toString() === sender._id.toString();
          }).code;
          if (!secret_code) {
            throw new Error(errors.something_went_wrong);
          }
          secret_code = tokenHelper.verify(secret_code);

          const content = tokenHelper.verify(invite.content, secret_code);

          const postOrComment =
            (await Post.findById(invite.info.post_id)) ||
            (await Comment.findById(invite.info.post_id));

          // const isUserLiked = postOrComment.likes.find((like) => {
          //   return like === user.username;
          // });
          // const isUserDisliked = postOrComment.dislikes.find((dislike) => {
          //   return dislike === user.username;
          // });

          // const likes = postOrComment.likes.length;
          // const dislikes = postOrComment.dislikes.length;

          // postOrComment.likesInfo = {
          //   likesRate: likes - dislikes,
          //   isLiked: isUserLiked ? true : isUserDisliked ? false : null,
          // };

          // const count = await Comment.count({ post_id: postOrComment._id });
          // postOrComment.commentsInfo = { count };

          invite.post = postOrComment;
          invite.sender = sender;
          invite.content = content;
        }

        for (let i = 0; sent[i] !== undefined; i++) {
          const invite = sent[i];

          const postOwner = await User.findById(invite.receiver_id);

          let secret_code = user.message_codes.find((code) => {
            return code.user_id.toString() === postOwner._id.toString();
          }).code;
          if (!secret_code) {
            throw new Error(errors.something_went_wrong);
          }
          secret_code = tokenHelper.verify(secret_code);

          const content = tokenHelper.verify(invite.content, secret_code);

          const postOrComment =
            (await Post.findById(invite.info.post_id)) ||
            (await Comment.findById(invite.info.post_id));

          const isUserLiked = postOrComment.likes.find((like) => {
            return like === user.username;
          });
          const isUserDisliked = postOrComment.dislikes.find((dislike) => {
            return dislike === user.username;
          });

          const likes = postOrComment.likes.length;
          const dislikes = postOrComment.dislikes.length;

          postOrComment.likesInfo = {
            likesRate: likes - dislikes,
            isLiked: isUserLiked ? true : isUserDisliked ? false : null,
          };

          const count = await Comment.count({ post_id: postOrComment._id });
          postOrComment.commentsInfo = { count };

          invite.post = postOrComment;
          invite.content = content;
        }

        for (let i = 0; accepted_old[i] !== undefined; i++) {
          const invite = accepted_old[i];

          const postOwner = await User.findById(invite.receiver_id);

          let secret_code = user.message_codes.find((code) => {
            return code.user_id.toString() === postOwner._id.toString();
          }).code;
          if (!secret_code) {
            throw new Error(errors.something_went_wrong);
          }
          secret_code = tokenHelper.verify(secret_code);

          const content = tokenHelper.verify(invite.content, secret_code);

          const postOrComment =
            (await Post.findById(invite.info.post_id)) ||
            (await Comment.findById(invite.info.post_id));

          invite.post = postOrComment;
          invite.receiver = postOwner;
          invite.content = content;
        }

        return {
          accepted_new,
          incoming,
          sent,
          accepted_old,
        };
      } catch (e) {
        return e;
      }
    },
    getHomepage: async (parent, { token }) => {
      try {
        const user = await verificateUser({ token });

        const posts = await Post.find();

        const shuffle = (v) => {
          for (
            let j, x, i = v.length;
            i;
            // eslint-disable-next-line radix
            j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x
          );
          return v;
        };

        shuffle(posts);

        for (let i = 0; posts[i] !== undefined; i++) {
          const post = posts[i];

          if (ObjectId.isValid(post.user_id)) {
            const postOwner = await User.findById(post.user_id);
            post.user = postOwner;
          }

          const isUserLiked = post.likes.find((like) => {
            return like === user.username;
          });
          const isUserDisliked = post.dislikes.find((dislike) => {
            return dislike === user.username;
          });

          const likes = post.likes.length;
          const dislikes = post.dislikes.length;

          post.likesInfo = {
            likesRate: likes - dislikes,
            // eslint-disable-next-line no-nested-ternary
            isLiked: isUserLiked ? true : isUserDisliked ? false : null,
          };

          const comments = await Comment.find({ post_id: post._id });
          const count = await Comment.count({ post_id: post._id });

          post.commentsInfo = { comments, count };
        }

        return posts;
      } catch (e) {
        return e;
      }
    },
    notificationsCount: async (parent, { token }) => {
      const user = await verificateUser({ token });
      const accepted_new_count = await Message.count({
        'info.type': 'invite',
        sender_id: user._id,
        'info.accepted': true,
        'info.did_user_see': false,
      });

      const incoming_count = await Message.count({
        'info.type': 'invite',
        receiver_id: user._id,
        'info.accepted': false,
      });

      return accepted_new_count + incoming_count;
    },
  },
};

module.exports = resolvers;
