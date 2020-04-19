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
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    
    room:{
        type:String,
    },
    available:{
        type:Boolean,
        default:true
    },
    volunteerID:{
        type:String
    }
    
})

blindUserSchema.methods.genrateTokens=async function(){
    user = this
    const token = jwt.sign({_id:user._id},'blindUserSystem')
    user.token=token
    await user.save()
    return token
}

blindUserSchema.statics.isAvailable =async(email)=>{
    const user = await blindUser.findOne({email})
    if(user){
        return false
    }
    return true
}

blindUserSchema.statics.validateCredentials=async(email, password)=>{
    const user = await blindUser.findOne({email})
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