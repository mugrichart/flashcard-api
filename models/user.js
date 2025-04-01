
import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Plugin for custom error messages on uniqueness violations
UserSchema.plugin(mongooseUniqueValidator, {
    message: '{PATH} already in use.'
});

export default mongoose.model('User', UserSchema);
