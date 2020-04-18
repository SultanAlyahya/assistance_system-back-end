const mongoose = require('mongoose')
var validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
    name:{
        type:String,
        required:true, 
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        
    },
    notificationToken:{
        type:String,
        
    },
    enableCalls:{
        type:Boolean,
        default:true,
    },
    calls:{
        type:Number,
        default:0,
    },
    rate:{
        type:Number,
        default:0,
        usersRate:[{
            type:Number,
            user:{
                type:mongoose.Types.ObjectId,
                ref:'User'
            }
        }]
    }
})

volunteerSchema.methods.toJSON= function(){
const user = this
const userObject = user.toObject()

delete userObject.password
delete userObject.token
delete userObject._id

return userObject

}

volunteerSchema.methods.genrateTokens=async function(){
    const Volunteer = this
    const token = jwt.sign({_id:Volunteer._id},'blindUserSystem')
    Volunteer.token=token
    await Volunteer.save()
    return token
}


volunteerSchema.statics.isAvailable =async(email)=>{
    const Volunteer = await volunteer.findOne(email)
    if(Volunteer){
        return false
    }
    return true
}

volunteerSchema.statics.validateCredentials=async(email, password)=>{
    console.log(email)
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
        const Volunteer = this
        if(Volunteer.isModified('password')){
            Volunteer.password = await bcrypt.hash(Volunteer.password, 2)
        }
        next()
    }catch(error){

    }

})

const volunteer = mongoose.model('volunteer', volunteerSchema)

module.exports = volunteer