/**
 * @fileoverview Defines the Mongoose User model and schema.
 * Includes password hashing middleware and authentication utilities.
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} User
 * @property {string} username - The user's display name (must be unique).
 * @property {string} email - The user's unique email address (lowercased).
 * @property {string} password - The user's hashed password (never stored in plain text).
 * @property {Date} createdAt - Timestamp indicating when the user account was created.
 * @property {Date} updatedAt - Timestamp indicating the last update to the user account.
 */

/**
 * Main User schema.
 * Each document represents a registered user in the system.
 * The password is hashed before saving to the database using bcrypt.
 *
 * @constant
 * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

/**
 * Pre-save middleware to hash the user's password before saving.
 * 
 * @function
 * @name pre('save')
 * @memberof module:models/User
 * @param {import('mongoose').HookNextFunction} next - Mongoose middleware callback.
 * @returns {Promise<void>}
 * 
 * @description
 * - If the password field hasn't been modified, the middleware continues without rehashing.
 * - If the password is new or modified, it generates a salt and hashes the password using bcrypt.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) { 
    next(err); 
  }
});

/**
 * Compares an entered password with the hashed password stored in the database.
 *
 * @async
 * @function matchPassword
 * @memberof module:models/User
 * @param {string} enteredPassword - The plain text password entered by the user.
 * @returns {Promise<boolean>} Returns true if the passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Mongoose model representing the User collection.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
