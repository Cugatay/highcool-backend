const { Types } = require('mongoose');
const errors = require('../../errors.json');

const Post = require('../../models/PostModel');
const User = require('../../models/UserModel');
const Comment = require('../../models/CommentModel');
const Message = require('../../models/MessageModel');

const tokenHelper = require('../../helpers/token');
const verificateUser = require('../../helpers/verificateUser');
const createMessage = require('../../helpers/createMessage');

const { ObjectId } = Types;

const resolvers = {
  Query: {
    async post(parent, { token, post_id }) {
      try {
        const clientUser = await verificateUser({ token });

        const post = await Post.findById(post_id);
        let user;
        if (ObjectId.isValid(post.user_id)) {
          user = await User.findById(post.user_id);
        }
        return { ...post.toObject(), user, clientUser };
      } catch (e) {
        return e;
      }
    },
    // async showAllComments
    // async loadNewComments ----------------> takes your first createdDate and find all new comments
  },
  Mutation: {
    async createPost(parent, { token, content, isPrivate /* , private_code */ }) {
      if (!content || content[0] === ' ') {
        throw new Error(errors.fill_required_values);
      }
      try {
        const user = await verificateUser({ token });

        const newPost = await new Post({
          user_id: isPrivate ? tokenHelper.generate({ user_id: user._id }) : user._id,
          content,
          likes: [],
          dislikes: [],
          comments: [],
        });

        await newPost.save((err) => {
          if (err) throw err;
        });

        if (!isPrivate) {
          await user.update({
            $push: {
              posts: [newPost._id],
            },
          });
        }

        return { message: 'success', post_id: newPost._id };
      } catch (e) {
        return e;
      }
    },

    async votePostOrCommentToggle(parent, { token, object_id, isLiked }) {
      try {
        const user = await verificateUser({ token });

        const postOrComment =
          (await Post.findById(object_id)) || (await Comment.findById(object_id));
        if (postOrComment === null) throw new Error(errors.post.not_found);

        const isUserLiked = postOrComment.likes.find((like) => {
          return like === user.username;
        });

        const isUserDisliked = postOrComment.dislikes.find((dislike) => {
          return dislike === user.username;
        });

        if (!isUserLiked && !isUserDisliked) {
          if (isLiked) {
            await postOrComment.update({
              $push: {
                likes: [user.username],
              },
            });
          } else {
            await postOrComment.update({
              $push: {
                dislikes: [user.username],
              },
            });
          }
        } else if (isUserLiked && isLiked) {
          await postOrComment.update({ $pull: { likes: user.username } });
        } else if (isUserDisliked && !isLiked) {
          await postOrComment.update({ $pull: { dislikes: user.username } });
        } else if (isUserLiked) {
          await postOrComment.update({
            $push: {
              dislikes: [user.username],
            },
            $pull: { likes: user.username },
          });
        } else {
          await postOrComment.update({
            $push: {
              likes: [user.username],
            },
            $pull: { dislikes: user.username },
          });
        }

        return { message: 'success' };
      } catch (e) {
        return e;
      }
    },

    async commentPost(parent, { token, post_id, content, isPrivate /* , private_code */ }) {
      if (!post_id || !content || content[0] === ' ') {
        throw new Error(errors.fill_required_values);
      }
      try {
        const user = await verificateUser({ token });

        const post = await Post.findById(post_id);

        if (!post) {
          throw new Error(errors.post.not_found);
        }

        const newComment = await new Comment({
          user_id: isPrivate ? tokenHelper.generate({ user_id: user._id }) : user._id,
          post_id,
          content,
          likes: [],
          dislikes: [],
        });

        await newComment.save((err) => {
          if (err) throw err;
        });

        if (!isPrivate) {
          await user.update({
            $push: {
              comments: [newComment._id],
            },
          });
        }

        return { message: 'success', comment_id: newComment._id };
      } catch (e) {
        return e;
      }
    },

    async learnPostOwner(parent, { token, post_id, content }) {
      if (!post_id || !content || content[0] === ' ') {
        throw new Error(errors.fill_required_values);
      }

      const user = await verificateUser({ token });
      await createMessage({ user, post_id, content, message_type: 'invite' });

      return { message: 'success' };
    },
    async acceptOrDeclineInvite(parent, { token, invite_id, isAccepted }) {
      try {
        const user = await verificateUser({ token });
        const invite = await Message.findById(invite_id);

        if (!invite) {
          throw new Error(errors.invite.not_found);
        }

        if (user._id.toString() !== invite.receiver_id.toString()) {
          throw new Error(errors.invite.not_authorised);
        }

        if (invite.info.type !== 'invite') {
          throw new Error(errors.invite.not_found);
        }

        // if (invite.info.accepted === isAccepted) {
        //   throw new Error(errors.invite.already_accepted);
        // }

        if (isAccepted) {
          await invite.updateOne({ 'info.accepted': true });
        } else {
          invite.deleteOne();
        }

        return { message: 'success' };
      } catch (e) {
        return e;
      }
    },
  },
};

module.exports = resolvers;
