const { gql } = require('apollo-server');

const typeDefs = gql`
  #  type Notification { # Will set TODO
  #    user_id: ID!
  #  }

  type MessageInfo {
    type: String! # (normal, invite)
    post_id: ID
    accepted: Boolean
  }

  type Message { # Will set TODO
    sender_id: ID!
    receiver_id: ID
    content: String
    info: MessageInfo!
  }

  type Token {
    token: String!
    user: User
  }

  type Query {
    user(token: String!, username: String!): User
  }

  type Mutation {
    login(usernameOrEmail: String!, password: String!): Token
    register(username: String!, password: String!, email: String!): Token

    resendEmail(token: String!): ResMsg
    verifyEmail(token: String!, code: String!): ResMsg

    followUserToggle(token: String!, target_username: String!): ResMsg
  }
`;

module.exports = typeDefs;
