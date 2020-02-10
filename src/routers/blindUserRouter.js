const express = require('express')
const blindUser = require('../db/Schemas/blindUser')

const router = express.Router()

router.post('/User/Signup', async(req, res)=>{
     const isAvailable = await blindUser.isAvailable(req.body.phoneNumber)
     if(isAvailable){
          const newBlindUser = new blindUser(req.body)
          try{
               await newBlindUser.save()
               res.status(201).send(newBlindUser)
          }catch(error){
               res.status(500).send(error.message)
          }
     }else{
          res.status(501).send({error:"the phone number has been used"})
     }
  })

router.post('/User/Login', async(req, res)=>{
     try{    
          const user = await blindUser.validateCredentials(req.body.phoneNumber, req.body.password)
          if(user){
               res.send(user)
         }else{
              res.status(404).send()
         }
        
   }catch(error){
        res.status(500).send({"error":error.message})
   }
})

module.exports = router