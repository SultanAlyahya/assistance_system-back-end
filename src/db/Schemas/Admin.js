const mongoose = require('mongoose')
var validator = require('validator');
const bcrypt = require('bcrypt')

const adminSchema = mongoose.Schema({
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
    },
})

volunteerSchema.methods.hash=async function(req, res, next){
    
    volunteer.password = bcrypt.hash(volunteer.password)
}

volunteerSchema.statics.validateCredentials=async(email, password)=>{
    const Volunteer = await volunteer.findOne({email})
    if(!Volunteer){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, Volunteer.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return Volunteer

}

volunteerSchema.pre('save', async function(next){
    try{
        const volunteer = this
        volunteer.password = await bcrypt.hash(volunteer.password, 2)
        console,log(volunteer.password)
        next()
    }catch(error){

    }

})

const admin = mongoose.model('admin', adminSchema)

module.exports = admin

