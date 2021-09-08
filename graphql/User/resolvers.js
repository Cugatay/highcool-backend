// const jwt = require('jsonwebtoken');
// const shortid = require('shortid');
const bcrypt = require('bcrypt');
const errors = require('../../errors.json');

const User = require('../../models/UserModel');

const tokenHelper = require('../../helpers/token');
const verificateUser = require('../../helpers/verificateUser');
// const emailSender = require('../../helpers/emailSender');

const resolvers = {
  Query: {
    async user(parent, { token, username }) {
      try {
        const clientUser = await verificateUser({ token });
        const user = await User.findOne({ username }); // .select('-password');

        if (!user) throw new Error(errors.user.not_found);

        return { ...user.toObject(), clientUser };
      } catch (e) {
        return e;
      }
    },
  },
  Mutation: {
    async login(parent, { usernameOrEmail, password }) {
      try {
        if (!usernameOrEmail || !password || usernameOrEmail[0] === ' ' || password[0] === ' ') {
          throw new Error(errors.fill_required_values);
        }

        const user = await verificateUser({ usernameOrEmail, password });

        return {
          user: { ...user._doc, password: null },
          token: tokenHelper.generate({ usernameOrEmail: user.username, password }),
        };
      } catch (e) {
        return e;
      }
    },

    async register(parent, { username, password }) {
      if (!username || !password || username[0] === ' ' || password[0] === ' ') {
        throw new Error(errors.fill_required_values);
      }

      // function validateEmail(getMail) {
      //   const re = /^(([^<>()[\]\\.,;:
      // \s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.
      // [0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //   return re.test(String(getMail).toLowerCase());
      // }

      try {
        const existUser = await User.findOne({ username });
        const cryptedPassword = await bcrypt.hash(password, 13);
        // const isEmailValid = validateEmail(email);
        // if (!isEmailValid) throw new Error(errors.user.email_is_not_valid);

        if (existUser) {
          if (existUser.username === username) throw new Error(errors.user.username_is_in_use);
          // if (existUser.email === email) throw new Error(errors.user.email_is_in_use);
        }
        // const email_verification_code = shortid.generate();

        const newUser = await new User({
          username,
          password: cryptedPassword,
          // email,
          // email_verification_code,
        });
        await newUser.save((err) => {
          if (err) throw err;
        });

        // -----------------------------------------
        // await emailSender({ email, code: email_verification_code });
        // -----------------------------------------

        return {
          user: { ...newUser._doc, password: null },
          token: tokenHelper.generate({ usernameOrEmail: username, password }),
        };
      } catch (e) {
        return e;
      }
    },
    // async resendEmail(parent, { token }) {
    //   try {
    //     const { usernameOrEmail, password } = tokenHelper.verify(token);
    //     const user = await verificateUser({ usernameOrEmail, password });
    //     if (!user.email_verification_code) {
    //       throw new Error(errors.email_verification.already_verified);
    //     }

    //     await emailSender({ email: user.email, code: user.email_verification_code });

    //     return { message: 'success' };
    //   } catch (e) {
    //     return e;
    //   }
    // },
    // async verifyEmail(parent, { token, code }) {
    //   try {
    //     const { usernameOrEmail, password } = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    //     const user = await verificateUser({ usernameOrEmail, password });

    //     if (!user.email_verification_code)
    //       throw new Error(errors.email_verification.already_verified);
    //     if (user.email_verification_code !== code) {
    //       throw new Error(errors.email_verification.code_does_not_match);
    //     }

    //     user.update({ email_verification_code: null }, (err) => {
    //       if (err) throw err;
    //     });

    //     return { message: 'success' };
    //   } catch (e) {
    //     return e;
    //   }
    // },

    async followUserToggle(parent, { token, target_username }) {
      try {
        const user = await verificateUser({ token });
        if (user.username === target_username)
          throw new Error(errors.follow_user.target_user_must_be_different_person);

        const targetUser = await User.findOne({ username: target_username });

        if (!targetUser) throw new Error(errors.follow_user.target_not_found);

        const isAlreadyFollowing = user.following.find(
          (following_username) => following_username === target_username,
        );

        if (!isAlreadyFollowing) {
          user.following.push(target_username);
          targetUser.followers.push(user.username);
        } else {
          user.following = user.following.filter(
            (following_username) => following_username !== target_username,
          );
          targetUser.followers = targetUser.followers.filter(
            (follower_username) => follower_username !== user.username,
          );
        }

        await user.update({ following: user.following });
        await targetUser.update({ followers: targetUser.followers });

        return { message: !isAlreadyFollowing ? 'added' : 'removed' };
      } catch (e) {
        return e;
      }
    },
  },
};

module.exports = resolvers;
