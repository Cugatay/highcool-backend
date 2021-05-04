require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const schema = require('./graphql/index');

const app = express();
const PORT = 5000;

const server = new ApolloServer({
  schema,
  playground: !process.env.PRODUCTION,
});

server.applyMiddleware({ app });

/* Server restarting steps:
 * 1. be sure about you pushed and pulled git
 * 2. pm2 restart index
 */

if (!process.env.PRODUCTION) {
  app.use(cors());
}

// MongoDB Connection
mongoose.connect(
  `mongodb://${process.env.PRODUCTION ? 'mongo-db' : 'localhost'}:27017/highcool`,
  { useNewUrlParser: true },
  (err) => {
    if (err) throw err;

    console.log('MongoDB server has connected succesfully');
  },
);

app.listen(
  PORT,
  /* '127.0.0.1', */ () => console.log(`🚀 Server ready at http://localhost:${PORT}`),
);
