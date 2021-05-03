const { stitchSchemas } = require('graphql-tools');

const userSchema = require('./User');
const postSchema = require('./Post');
const pageRequests = require('./PageRequests');

const stitchedSchema = stitchSchemas({
  subschemas: [
    { schema: userSchema, batch: true },
    { schema: postSchema, batch: true },
    { schema: pageRequests, batch: true },
  ],
});

module.exports = stitchedSchema;
