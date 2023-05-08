const mongoose = require('mongoose')
const { Schema } = mongoose;

const cardSchema = new Schema({
    id: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    imageSource: { type: String, required: true },
    isFlipped: { type: Boolean, required: true },
    isLandscape: {
        type: Boolean,
        default: false,
      },
}, { timestamps: true });

module.exports.cardSchema = cardSchema;
module.exports.Card = mongoose.model('card', cardSchema);