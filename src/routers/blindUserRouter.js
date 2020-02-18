const express = require('express')
const blindUser = require('../db/Schemas/blindUser')
const image = require('../db/Schemas/image')
const authorization = require('../middleware/middleware')
const multer = require('multer')
const upload = multer({
     dest:'images'
})

const router = express.Router()

router.post('/User/Signup', async(req, res)=>{
     console.log('in')
     const isAvailable = await blindUser.isAvailable(req.body.email)
     console.log(isAvailable)
     if(isAvailable){
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
     }else{
          res.status(501).send({error:"the email has been used"})
     }
  })

router.post('/User/Login', async(req, res)=>{
     
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

router.post('/User/image',upload.single('photo'), (req, res)=>{
     console.log('file', req.files)
  console.log('body', req.body)
  res.status(200).send({
    message: 'success!',
  })
})

router.post('/User/Upload', (req, res)=>{
     try{
          
     }catch(error){

     }
})

module.exports = router