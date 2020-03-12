const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const blindUser = require('../db/Schemas/blindUser')
const volunteer = require('../db/Schemas/volunteer')

const userAuthorization = async(req, res, next)=>{
    try{
        const decoded = jwt.verify(req.header('token').replace('Bearer ',''),'blindUserSystem')
        const user = await blindUser.findById(decoded._id)
        req.user = user
        next()
    }catch(error){
        console.log(error.message)
        next()
    }
}

const volunteerAuthorization = async(req, res ,next)=>{
    try{
        const decoded = jwt.verify(req.header('token').replace('Bearer ',''),'blindUserSystem')
        const Volunteer = await volunteer.findById(decoded._id)
        req.Volunteer = Volunteer
        next()
    }catch(error){
        console.log(error.message)
        next()
    }
}

module.exports = {userAuthorization, volunteerAuthorization}
