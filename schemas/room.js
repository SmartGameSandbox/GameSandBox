const mongoose = require('mongoose')
const { Schema } = mongoose;

const roomSchema = new Schema({
    id: { type: String, index: true, unique: true, required: true },
    name: { type: String, maxlength: 20, required: true },
    cards: { type: Array, required: false },
    users: {
        type: Array,
        required: false,
        default: []
    },
    expireAt: {
        type: Date,
        expires: "24h", default: Date.now
    },
    image: String,
    password: { type: String, min: [4, 'Password too short'], max: [20, 'Password too long'] },
}, { timestamps: true });

module.exports.roomSchema = roomSchema;
module.exports.Room = mongoose.model('room', roomSchema);