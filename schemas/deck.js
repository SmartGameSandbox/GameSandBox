const mongoose = require('mongoose');
const { Card } = require('./card');
const { Schema } = mongoose;

const deckSchema = new Schema({
    cards: {type: [Card], required: true}
});

module.exports.deckSchema = deckSchema;
module.exports.Deck = mongoose.model('deck', deckSchema);