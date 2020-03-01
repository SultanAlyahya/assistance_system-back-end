const express = require('express')
const admin = require('../db/Schemas/Admin')
const authorization = require('../middleware/middleware')


const router = express.Router()

router.post('/Admin/Signup', async(req, res)=>{
     console.log('in')
     
     
          const newBlindUser = new blindUser(req.body)
          const token = await newBlindUser.genrateTokens()
          try{
               console.log('in2')
               await newBlindUser.save()
               console.log('in3')
               res.set('token', token)
               res.status(201).send(newBlindUser)
          }catch(error){
               res.status(500).send(error.message)
          }
  })

router.post('/Admin/Login', async(req, res)=>{
     
     try{    
          const BlindUser = await blindUser.validateCredentials(req.body.email, req.body.password)
          if(BlindUser){
               const token = await BlindUser.genrateTokens()
               res.set({'token': token,
               "Accept": "application/json"})
               res.status(200).send(BlindUser)
         }else{
              res.status(404).send()
         }
        
   }catch(error){
        res.status(500).send({"error":error.message})
   }
})

router.get('/User', authorization, async(req, res)=>{
     console.log(req.user)
     res.send()
})

router.post('/User/Logout', authorization, async(req, res)=>{
     const user = req.user
     user.token = ''
     user.save()
     res.send('done')
})





module.exports = router