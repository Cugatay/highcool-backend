const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const generalTypeDefs = require('../generalTypeDefs');
const Post = require('./Post');

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs, generalTypeDefs],
  resolvers: [resolvers, Post],
});
