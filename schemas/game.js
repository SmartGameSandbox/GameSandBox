// Schema for games that have been created by users.
// Games save information such as the game's name, number of players, creator's id, and the card deck used*.
// *Should probably rename cardDeck (used in server.js as well) to gameObjects as it is a collection of uploaded game objects.
// Not to be confused with Rooms, which are Games that are currently hosted and or in play.

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
