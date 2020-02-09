const mongoose = require('mongoose')

const volunteerSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,

    },
    userName:{
        type:String,
        required:true, 
    },
    password:{
        type:String,
        required:true,
    }
})

const volunteer = mongoose.model('volunteer', volunteerSchema)

module.exports = volunteer