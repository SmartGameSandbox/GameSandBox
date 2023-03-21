const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardv2Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      immutable: true,
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    imageSource: {
      data: Buffer,
      contentType: String,
    },
    type: { type: String, required: true, enum: ["front", "back"] },
    isFlipped: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports.cardv2Schema = cardv2Schema;
module.exports.CardV2 = mongoose.model("cardsv2", cardv2Schema);