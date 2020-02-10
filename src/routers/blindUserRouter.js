const express = require('express')
const blindUser = require('../db/Schemas/blindUser')

const router = express.Router()

router.post('/User', async(req, res)=>{
   const newBlindUser = new blindUser(req.body)
    try{
        await newBlindUser.save()
        res.status(201).send(newBlindUser)
   }catch(error){
        res.status(500).send(error)
   }
})

module.exports = router