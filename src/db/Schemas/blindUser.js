const mongoose = require('mongoose')
var validator = require('validator');

const blindUserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:20,
        minlength:3
    },
    phoneNumber:{
        type:String,
        required:true,
        minlength:10,
        maxlength:12,
    },
})

const blindUser = mongoose.model('blindUser', blindUserSchema)

module.exports = blindUser