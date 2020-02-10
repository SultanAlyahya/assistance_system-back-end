const express = require('express')
const blindUser = require('../db/Schemas/blindUser')

const router = express.Router()

router.post('/User/Signup', async(req, res)=>{
     const newBlindUser = new blindUser(req.body)
      try{
          await newBlindUser.save()
          res.status(201).send(newBlindUser)
     }catch(error){
          res.status(500).send(error)
     }
  })

router.post('/User/Login', async(req, res)=>{
     try{    
          const BlindUser = await blindUser.find(req.body)
          if(BlindUser){
               res.send(BlindUser)
         }else{
              res.status(404).send()
         }
        
   }catch(error){
        res.status(500).send("error",error)
   }
})

module.exports = router