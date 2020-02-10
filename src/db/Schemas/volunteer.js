const mongoose = require('mongoose')
var validator = require('validator');
const bcrypt = require('bcrypt')

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

volunteerSchema.methods.hash=async function(req, res, next){
    
    volunteer.password = bcrypt.hash(volunteer.password)
}

volunteerSchema.pre('save', async function(){
    const volunteer = this
    volunteer.password = await bcrypt.hash(volunteer.password, 2)
    console,log(volunteer.password)

})

const volunteer = mongoose.model('volunteer', volunteerSchema)

module.exports = volunteer