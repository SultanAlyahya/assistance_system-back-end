const express = require('express')
const blindUser = require('../db/Schemas/blindUser')
const image = require('../db/Schemas/image')
const {userAuthorization} = require('../middleware/middleware')
const sharp = require('sharp');
const volunteer = require('../db/Schemas/volunteer')

var admin = require("firebase-admin");

var serviceAccount = require("../bpas-5ad0d-firebase-adminsdk-rxw9x-6896308850.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bpas-5ad0d.firebaseio.com"
  });



const router = express.Router()


router.post('/User/notifications', userAuthorization, async(req, res)=>{
     const messages = [];
     const user = req.user
     try{
          const volunteers = await volunteer.find({enableCalls:true})
          user.call.room=req.body.room
          user.save()
          console.log(user)
          volunteers.forEach(Volunteer => {
               if(Volunteer.notificationToken){
               messages.push({
                    notification: {title: 'call received', body: 'you received call for help'},
                    token: Volunteer.notificationToken,
                    data: {room:req.body.room},
               });
               }
          })
          admin.messaging().sendAll(messages)
          .then((response) => {
          console.log(response.successCount + ' messages were sent successfully');
          res.send()
          });
          //console.log(messages)

          
          
     }catch(error){
          console.log(error)
          res.status(500).send()
     }
     })

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

router.get('/User', userAuthorization, async(req, res)=>{
     console.log(req.user)
     res.send()
})

router.post('/User/Logout', userAuthorization, async(req, res)=>{
     const user = req.user
     user.token = ''
     user.save()
     res.send('done')
})

module.exports = router