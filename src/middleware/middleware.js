const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const blindUser = require('../db/Schemas/blindUser')

const authorization = async(req, res, next)=>{
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

module.exports = authorization