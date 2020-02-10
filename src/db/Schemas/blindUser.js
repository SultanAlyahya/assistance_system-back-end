const mongoose = require('mongoose')
var validator = require('validator');
const bcrypt = require('bcrypt')

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
    password:{
        type:String,
        required:true,
    }
})

blindUserSchema.statics.isAvailable =async(phoneNumber)=>{
    const user = await blindUser.findOne({phoneNumber})
    if(user){
        return false
    }
    return true
}

blindUserSchema.statics.validateCredentials=async(phoneNumber, password)=>{
    const user = await blindUser.findOne({phoneNumber})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user

}

blindUserSchema.pre('save', async function(next){
    try{
        const user = this
        user.password = await bcrypt.hash(user.password, 2)
        next()
    }catch(error){

    }

})

const blindUser = mongoose.model('blindUser', blindUserSchema)

module.exports = blindUser