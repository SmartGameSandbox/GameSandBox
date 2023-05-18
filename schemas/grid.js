// Schema for a collection of homogeneously-typed game object (Deck of cards and only cards).
// Named grid by team 2 probably due to the only game objects that could be uploaded by then being a tile grid of
// cards that would be sliced up. Could potentially rename to deck.
// Each "grid" is a deck of Cards, Tokens, Pieces, or Boards.
// Each "grid" has a imageGrid that will be sliced up and assigned to the objects inside this grid.
// To add custom game objects, create a custom_object_name.jsx inside the deck directory.
// Then insert the type inside the type enums in this schema.
// Notes: the field "name" is currently redundant as each grid has an unique _id that is used to load them.
// Notes: the field "numCards" is currently redundant (and poorly named) and deck.length should be used instead.

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