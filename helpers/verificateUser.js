const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const errors = require('../errors.json');

const User = require('../models/UserModel');

const verificateUser = async ({ token, usernameOrEmail, password }) => {
  if (!token) {
    if (!usernameOrEmail || !password) throw new Error(errors.fill_required_values);
  }

  if (token) {
    // Encrypt the token and set the usernameOrEmail values and password
    const tokenUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

    usernameOrEmail = tokenUser.usernameOrEmail;
    password = tokenUser.password;
  }

  const user = await User.findOne({
    username: usernameOrEmail,
    // $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) throw new Error(errors.user.logistration_error);

  const passwordVerification = await bcrypt.compare(password, user.password);

  if (!passwordVerification) throw new Error(errors.user.logistration_error);

  // if (token && user.email_verification_code) throw new Error(errors.user.activate_email);

  return user;
};

module.exports = verificateUser;
