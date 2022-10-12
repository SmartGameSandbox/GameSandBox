const mongoose = require('mongoose')
const { Schema } = mongoose;
const roomSchema = new Schema({
    id: { type: String, index: true, unique: true, required: true },
    name: { type: String, maxlength: 20, required: true },
    users: {
        type: Array,
        required: false,
        default: []
    },
    expireAt: {
        type: Date,
        expires: "60m", default: Date.now
    },
    password: { type: String, required: true, min: [4, 'Password too short'], max: [20, 'Password too long'] },
});

module.exports.roomSchema = roomSchema;
module.exports.Room = mongoose.model('room', roomSchema);