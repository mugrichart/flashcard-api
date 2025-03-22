
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Plugin for custom error messages on uniqueness violations
UserSchema.plugin(require('mongoose-unique-validator'), {
    message: '{PATH} already in use.'
});

module.exports = mongoose.model('User', UserSchema);
