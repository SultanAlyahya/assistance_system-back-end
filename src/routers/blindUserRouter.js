const express = require('express')
const blindUser = require('../db/Schemas/blindUser')
const image = require('../db/Schemas/image')
const {userAuthorization} = require('../middleware/middleware')
const sharp = require('sharp');
const { Expo } = require('expo-server-sdk')
const volunteer = require('../db/Schemas/volunteer')

const expo = new Expo();



const router = express.Router()
router.post('/User/notifications', async(req, res)=>{
     const messages = [];
     const volunteers = await volunteer.find({enableCalls:true})
     console.log(volunteers)
     volunteers.forEach(Volunteer => {
          
          if (!Expo.isExpoPushToken(Volunteer.notificationToken)) {
               console.error(`Push token ${pushToken} is not a valid Expo push token`);
               return;
             }
      
          messages.push({
               to: Volunteer.notificationToken,
               sound: 'default',
               body: 'This is a test notification',
               data: { withSome: 'data' },
          })
     })
     try{
          const chunks = expo.chunkPushNotifications(messages);
          (async () => {
               chunks.forEach(async(chunk) => {
                    const ticketChunk=await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk)
               })   
          })
     }catch(error){
          console.log(error)
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