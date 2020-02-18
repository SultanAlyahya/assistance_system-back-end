const mongoose = require('mongoose')
const validator = require('validator');
const jwt = require('jsonwebtoken');
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
    },
    token:{
        type:String,
    }
})

blindUserSchema.methods.genrateTokens=async function(){
    user = this
    const token = jwt.sign({_id:user._id},'blindUserSystem')
    user.token=token
    await user.save()
    return token
}

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
        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password, 2)
        }
        next()
    }catch(error){

    }

})


const blindUser = mongoose.model('blindUser', blindUserSchema)

module.exports = blindUser