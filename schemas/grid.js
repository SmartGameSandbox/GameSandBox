const mongoose = require("mongoose");

const gridSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numCards: {
    type: Number
  },
  imageGrid: {
    data: Buffer,
    contentType: String,
  },
  deck: [{
    id: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    pile: [],
    imageSource: {
      front: {
        data: Buffer,
        contentType: String,
      },
      back: {
        data: Buffer,
        contentType: String,
      }
    },
    type: {
      type: String,
      required: true,
      enum: ["Card", "Token", "Piece", "Board"]
    },
    isLandscape: {
      type: Boolean,
      default: true,
    },
    isFlipped: {
      type: Boolean,
      required: true
    },
  }],
  type: {
    type: String,
    required: true,
    enum: ["Card", "Token", "Piece", "Board"]
  },
}, {
  timestamps: true
});


module.exports.gridSchema = gridSchema;
module.exports.Grid = mongoose.model("grid", gridSchema);