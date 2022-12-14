const mongoose = require('mongoose')
const { Schema } = mongoose;
const userSchema = new Schema({
    username: { type: String, maxlength: 20, required: true, index: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, min: [4, 'Password too short'], max: [20, 'Password too long'] },
});

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('user', userSchema);