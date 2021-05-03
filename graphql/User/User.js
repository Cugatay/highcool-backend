/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const UserModel = require('../../models/UserModel');
const PostModel = require('../../models/PostModel');
const CommentModel = require('../../models/CommentModel');

const resolvers = {
  User: {
    followers: async (parent) => {
      try {
        const user = await UserModel.findOne({ username: parent.username });

        const user_followers = await UserModel.find({
          username: {
            $in: user.followers,
          },
        });
        return user_followers;
      } catch (e) {
        return e;
      }
    },
    following: async (parent) => {
      try {
        const user = await UserModel.findOne({ username: parent.username });

        const user_following = await UserModel.find({
          username: {
            $in: user.following,
          },
        });

        return user_following;
      } catch (e) {
        return e;
      }
    },
    posts: async (parent) => {
      try {
        const user = await UserModel.findOne({ username: parent.username });

        const posts = await PostModel.find({
          _id: {
            $in: user.posts,
          },
        });

        // const post_ids = [];

        for (let i = 0; posts[i] !== undefined; i++) {
          const post = posts[i];

          post.user = user;

          const isUserLiked = post.likes.find((like) => {
            return like === parent.clientUser.username;
          });
          const isUserDisliked = post.dislikes.find((dislike) => {
            return dislike === parent.clientUser.username;
          });

          const likes = post.likes.length;
          const dislikes = post.dislikes.length;

          post.likesInfo = {
            likesRate: likes - dislikes,
            // eslint-disable-next-line no-nested-ternary
            isLiked: isUserLiked ? true : isUserDisliked ? false : null,
          };

          const comments = await CommentModel.find({ post_id: post._id });
          const count = await CommentModel.count({ post_id: post._id });
          post.commentsInfo = { comments, count };
        }

        return posts;
      } catch (e) {
        return e;
      }
    },
    // comments: async (parent) => {
    //   // const sdsdfasdfasfasdfasdfasdfasdf;
    // },
  },
};

module.exports = resolvers;
