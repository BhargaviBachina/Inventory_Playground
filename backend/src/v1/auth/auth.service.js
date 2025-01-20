const Joi = require('joi');
const { findUserByUsername, findUserByEmail, createUser,findUserById } = require('./auth.queries');
const { hashPassword, comparePassword, generateToken } = require('./auth.utils');

// Joi schemas
const registerSchema = Joi.object({
  first_name: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    usernameOrEmail: Joi.string()
      .required()
      .messages({
        "alternatives.match": "Please provide a valid username or email.",
        "string.empty": "Username or Email is required.",
        "any.required": "Username or Email is required.",
      }),
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Password is required.",
        "any.required": "Password is required.",
      }),
  });

const register = (data) => {
  const { error, value } = registerSchema.validate(data);
  if (error) return Promise.reject({ status: 400, message: error.details[0].message });

  return findUserByUsername(value.username)
    .then((user) => {
      if (user) throw { status: 409, message: 'Username already exists' };
      return findUserByEmail(value.email);
    })
    .then((user) => {
      if (user) throw { status: 409, message: 'Email already exists' };
      return hashPassword(value.password);
    })
    .then((hashedPassword) =>
      createUser({ ...value, password: hashedPassword, status: 1 }).then(() => ({
        message: 'User registered successfully',
      }))
    );
};

const login = (data) => {
    const { error, value } = loginSchema.validate(data);
    if (error) return Promise.reject({ status: 400, message: error.details[0].message });
  
    return (
      findUserByUsername(value.usernameOrEmail) // Check if input matches a username
        .then((user) => {
          if (user) return user; // If found by username, return the user
          return findUserByEmail(value.usernameOrEmail); // Otherwise, check email
        })
        .then((user) => {
          if (!user) throw { status: 404, message: 'User not found' }; // No user found
          return comparePassword(value.password, user.password).then((isMatch) => {
            if (!isMatch) throw { status: 401, message: 'Invalid password' };
            return generateToken(user); // Generate token on success
          });
        })
        // Return token as response
        .then((token) => ({ token }))
    );
  };
  const getUserData = (userId) => {
    return findUserById(userId)  // Query the user from the database by user ID
      .then(userData => {
        if (!userData) {
          throw { status: 404, message: 'User not found' };
        }
        // Return necessary user information (email, username, profile image URL, etc.)
        return userData;
      })
      .catch((err) => {
        throw { status: err.status || 500, message: err.message || 'Internal Server Error' };
      });
  };
  
  
  module.exports = { register, login,getUserData };