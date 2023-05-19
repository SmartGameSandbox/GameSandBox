// Schema for currently hosted rooms.
// The field "cards" is an array of all cards that are on the table and not in a deck or hand.
// The field "tokens" is an array of all tokens that are on the table and not in a deck or hand.
// The field "pieces" is an array of all tokens that are on the table and not in a deck or hand.
// The field "hands" is an array of all participants hands.
// Hand is an array that contains any game object that the user possesses (and are inacccessible to others).
// Users is an array that contains the current participants.
// The field "deck" is an array of decks of homogeneously-typed game objects (see grid.js).


const mongoose = require('mongoose')
const { Schema } = mongoose;

const roomSchema = new Schema({
    id: { type: String, index: true, unique: true, required: true },
    name: { type: String, maxlength: 20, required: true },
    cards: { type: Array, required: false },
    deck: { type: Array, required: false },
    tokens: { type: Array, required: false },
    pieces: { type: Array, required: false },
    hands: { type: Object, required: false },
    users: {
        type: Array,
        required: false,
        default: []
    },
    expireAt: {
        type: Date,
        expires: "24h", default: Date.now
    },
}, { timestamps: true });

module.exports.roomSchema = roomSchema;
module.exports.Room = mongoose.model('room', roomSchema);