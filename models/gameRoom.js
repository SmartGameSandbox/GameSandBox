const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  roomName: String,
  id: {
    type: String,
    required: true
  },
  users: {
    type: Array,
    required: false
  },
  password: {
    type: String,
    required: true
  }
});

const gameRoom = mongoose.model('gameRoom', gameRoomSchema);

module.exports = gameRoom;
