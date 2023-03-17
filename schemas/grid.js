var mongoose = require('mongoose');
const { Schema } = mongoose;

const gridSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      img: {
        data: Buffer,
        contentType: String,
      },
}, { timestamps: true });

module.exports.gridSchema = gridSchema;
module.exports.Grid = mongoose.model('grid', gridSchema);