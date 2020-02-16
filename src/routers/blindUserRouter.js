const express = require('express')
const blindUser = require('../db/Schemas/blindUser')
const image = require('../db/Schemas/image')
const multer = require('multer')
const upload = multer({
     dest:'images'
})

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
     console.log('in')
     try{    
          const BlindUser = await blindUser.find(req.body)
          await blindUser.genrateTokens()
          if(BlindUser){
               res.send(BlindUser)
         }else{
              res.status(404).send()
         }
        
   }catch(error){
        res.status(500).send("error",error)
   }
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