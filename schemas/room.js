const mongoose = require('mongoose')
const { Schema } = mongoose;
const roomSchema = new Schema({
    roomNumber: { type : Number , unique : true, required : true, dropDups: true },
    name: String
});

module.exports.roomSchema = roomSchema;
module.exports.Room = mongoose.model('rooms', roomSchema);