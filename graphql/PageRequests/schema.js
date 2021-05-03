const { gql } = require('apollo-server');

const typeDefs = gql`
  type Invite {
    _id: ID!
    sender: User
    receiver: User
    content: String!
    post: Post!
  }

  type InviteResponse {
    accepted_new: [Invite]!
    incoming: [Invite]!
    sent: [Invite]!
    accepted_old: [Invite]!
  }

  type Homepage {
    posts: [Post!]
    notificationsCount: Int!
  }

  type Query {
    invites(token: String!): InviteResponse!
    getHomepage(token: String!): [Post]
    notificationsCount(token: String!): Int!
  }
`;

module.exports = typeDefs;
