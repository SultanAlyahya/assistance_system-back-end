const mongoose = require('mongoose')
var validator = require('validator');

const volunteerSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        validate: {
            validator:(email)=>{
                if(!validator.isEmail(email)){
                    throw new Error('the email is not valid')
                }
            }
        }    
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