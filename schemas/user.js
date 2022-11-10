const mongoose = require('mongoose')
const { Schema } = mongoose;
const userSchema = new Schema({
    username: { type: String, maxlength: 20, required: false },
    email: { type: String, required: false },
    password: { type: String, min: [4, 'Password too short'], max: [20, 'Password too long'] },
});

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('user', userSchema);


/*
   var mongoose = require('mongoose');
    var schema = mongoose.Schema({
        path : {type:string , required:true},
        title: {type:string , required: true}
    })
 module.export = mongoose.model('game', schema);
 */