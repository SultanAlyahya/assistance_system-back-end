const express = require('express')
const blindUser = require('../db/Schemas/blindUser')
const image = require('../db/Schemas/image')
const authorization = require('../middleware/middleware')
const multer = require('multer')
const fs = require("fs");
var FormData = require('form-data');

var unirest = require("unirest");


const detectText=async(file, res)=>{
    
     var request = require('request');
     var fs = require('fs');
     var options = {
       'method': 'POST',
       'url': 'https://microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com/ocr',
       'headers': {
         'x-rapidapi-host': 'microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com',
         'x-rapidapi-key': 'cd030e1ea2msh070cf39ee790c48p13b720jsnf874d7a09567',
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       //fs.createReadStream(file.path)
       formData: {
         'form': {
           'value': file.buffer,
           'options': {
             'filename': 'text.png',
             'contentType': null
           }
         }
       }
     };
     
     request(options,  async(error, response)=> { 
       if (error) throw new Error(error);
       var allWords = ""
       const text = JSON.parse(response.body)
       if(text)
       //text.regions[0].lines.forEach(words=>words.words.forEach(text=>{
          //console.log(text.text)
           //allWords+=text.text+" "
       //}))
       console.log(allWords)
       res.send(text)
       
       //console.log(text.regions[0].lines);
     });
     
     
}




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

const form = multer({
     //dest:'images',

})

router.post('/User/image',form.single('form'), async(req, res)=>{
    try{
     console.log(req.file)
     const text = await detectText(req.file, res)
     console.log("befor sending: ",text)
    //res.send(text)
    }catch(error){
         console.log(error)
    res.send(error.message)
    }
},(error, req, res, next)=>{
     console.log(error)
     res.send(error.message)
})

router.post('/User/Upload', (req, res)=>{
     try{
          
     }catch(error){

     }
})

module.exports = router