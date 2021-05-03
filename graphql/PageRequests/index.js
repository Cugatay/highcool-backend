const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const generalTypeDefs = require('../generalTypeDefs');

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs, generalTypeDefs],
  resolvers: [resolvers],
});
