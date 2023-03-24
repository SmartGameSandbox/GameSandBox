var mongoose = require("mongoose");
const { cardSchema } = require("./card");
const { Schema } = mongoose;

const gridSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    numCards: { type: Number },
    imageGrid: {
      data: Buffer,
      contentType: String,
    },
    deck: [
      {
        id: {
          type: String,
          required: true,
          immutable: true,
          unique: true,
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
    ],
  },
  { timestamps: true }
);

module.exports.gridSchema = gridSchema;
module.exports.Grid = mongoose.model("grid", gridSchema);
