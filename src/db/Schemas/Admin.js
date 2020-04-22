const mongoose = require('mongoose')
var validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
})

adminSchema.methods.hash=async function(req, res, next){
    
    admin.password = bcrypt.hash(volunteer.password)
}

adminSchema.statics.validateCredentials=async(email, password)=>{
    console.log(email)
    const Admin = await admin.findOne({email})
    if(!Admin){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, Admin.password)
    console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return Admin

}

adminSchema.pre('save', async function(next){
    try{
        const Admin = this
        Admin.password = await bcrypt.hash(Admin.password, 2)
        console,log(Admin.password)
        next()
    }catch(error){

    }

})

adminSchema.methods.genrateTokens=async function(){
    const Admin = this
    const token = jwt.sign({_id:Admin._id},'blindUserSystem')
    Admin.token=token
    await Admin.save()
    return Admin
}



const admin = mongoose.model('admin', adminSchema)

module.exports = admin

