const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    post(token: String!, post_id: ID!): Post
  }

  type createPostRespone {
    message: String!
    post_id: ID
  }

  type commentPostRespone {
    message: String!
    comment_id: ID
  }

  type Mutation {
    createPost(
      token: String!
      content: String!
      isPrivate: Boolean # private_code: String
    ): createPostRespone
    votePostOrCommentToggle(token: String!, object_id: ID!, isLiked: Boolean!): ResMsg

    commentPost(
      token: String!
      post_id: ID!
      content: String!
      isPrivate: Boolean # private_code: String
    ): commentPostRespone

    learnPostOwner(token: String!, post_id: ID!, content: String!): ResMsg
    acceptOrDeclineInvite(token: String!, invite_id: ID!, isAccepted: Boolean!): ResMsg
  }
`;

module.exports = typeDefs;
