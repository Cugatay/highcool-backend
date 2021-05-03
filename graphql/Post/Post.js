const { Types } = require('mongoose');
const CommentModel = require('../../models/CommentModel');
const UserModel = require('../../models/UserModel');

const { ObjectId } = Types;

const resolvers = {
  Post: {
    // tags: async () => {},
    likesInfo: async (parent) => {
      console.log(parent);
      const isUserLiked = parent.likes.find((like) => {
        return like === parent.clientUser.username;
      });
      const isUserDisliked = parent.dislikes.find((dislike) => {
        return dislike === parent.clientUser.username;
      });

      const likes = parent.likes.length;
      const dislikes = parent.dislikes.length;
      return {
        likesRate: likes - dislikes,
        // eslint-disable-next-line no-nested-ternary
        isLiked: isUserLiked ? true : isUserDisliked ? false : null,
      };
    },
    commentsInfo: async (parent) => {
      try {
        const comments = await CommentModel.find({ post_id: parent._id });
        // .limit(2)
        // .sort('-createdAt');
        const count = await CommentModel.count({ post_id: parent._id });

        // eslint-disable-next-line no-plusplus
        for (let i = 0; comments[i] !== undefined; i++) {
          const comment = comments[i];

          if (ObjectId.isValid(comment.user_id)) {
            // eslint-disable-next-line no-await-in-loop
            const user = await UserModel.findById(comment.user_id);
            comment.user = user;
          }

          const isUserLiked = comment.likes.find((like) => {
            return like === parent.clientUser.username;
          });
          const isUserDisliked = comment.dislikes.find((dislike) => {
            return dislike === parent.clientUser.username;
          });

          const likes = comment.likes.length;
          const dislikes = comment.dislikes.length;

          comment.likesInfo = {
            likesRate: likes - dislikes,
            // eslint-disable-next-line no-nested-ternary
            isLiked: isUserLiked ? true : isUserDisliked ? false : null,
          };
        }
        return { comments, count };
      } catch (e) {
        return e;
      }

      // user: User
      // _id: ID!
      // content: String!
      // likesRate: Int!
    },
  },
};

module.exports = resolvers;
