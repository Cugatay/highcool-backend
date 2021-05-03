const jwt = require('jsonwebtoken');

/*
  {
    expiresIn: expiresIn || '365d',
  }
*/

const token = {
  generate: (data, secretKey) => {
    return jwt.sign(data, secretKey || process.env.SECRET_TOKEN_KEY);
  },
  verify: (getToken, secretKey) => {
    return jwt.verify(getToken, secretKey || process.env.SECRET_TOKEN_KEY);
  },
};

module.exports = token;
