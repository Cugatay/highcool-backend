const { gql } = require('apollo-server');

const generalTypeDefs = gql`
  type LikesInfo {
    likesRate: Int!
    isLiked: Boolean
  }

  type CommentsInfo {
    comments: [Comment]
    count: Int
  }

  type User {
    username: String!
    # password: String
    nameSurname: String
    email: String!
    posts: [Post]
    comments: [Comment]
    followers: [User]
    following: [User]
    # messages: [Message]
    # message_invites: [Invite]
    # notifications: [Notification]
  }

  type Post {
    _id: ID!
    user: User
    # tags: [String]
    content: String!
    likesInfo: LikesInfo!
    commentsInfo: CommentsInfo!
    createdAt: String!
  }

  type Comment {
    user: User
    _id: ID!
    content: String!
    likesInfo: LikesInfo!
    createdAt: String!
  }

  type ResMsg {
    message: String!
  }
`;

module.exports = generalTypeDefs;
