const mongoose = require('mongoose')
const { Schema } = mongoose;
const userSchemna = new Schema({
    id: { type: String, index: true, unique: true, required: true },
    name: { type: String, maxlength: 20, required: true },
    email: {type: String, required: true},
    password: { type: String, min: [4, 'Password too short'], max: [20, 'Password too long'] },
});

module.exports.userSchema = userSchema;
module.exports.user = mongoose.model('user', userSchema);