const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    players: {
      type: Number,
      min: [1, "Not enough players"],
      max: [10, "Too many players"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
    },
    cardDeck: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

module.exports.gameSchema = gameSchema;
module.exports.Game = mongoose.model("game", gameSchema);
