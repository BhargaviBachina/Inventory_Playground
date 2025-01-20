const db = require('../../../config/db');

const findUserByUsername = (username) =>
  db('users').where({ username }).first();

// Corrected findUserByEmail function
const findUserByEmail = (email) => 
  db('users').where({ email }).first(); // Searching by email, not user_id


const findUserById = (userId) =>
  db('users')
    .select('username', 'email', 'profile_pic')  // Selecting relevant fields to return
    .where({ user_id: userId })
    .first(); // Since we are looking for a single user

const createUser = (user) =>
  db('users').insert(user);

module.exports = { findUserByUsername, findUserByEmail, createUser,findUserById };
