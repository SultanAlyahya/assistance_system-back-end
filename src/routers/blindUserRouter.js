const express = require('express')
const blindUser = require('../db/Schemas/blindUser')
const image = require('../db/Schemas/image')
const {userAuthorization} = require('../middleware/middleware')
const sharp = require('sharp');
const volunteer = require('../db/Schemas/volunteer')


var admin = require("firebase-admin");

var serviceAccount = require("../bpas-28773-firebase-adminsdk-c4jik-b11a5030b7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bpas-28773.firebaseio.com"
});




const router = express.Router()

router.get('/notiTest', async(req, res)=>{
     var registrationToken = 'f92VmYkl-84:APA91bENYvgwQhAnccYz2L_neKww5rAnFtPbcYU-u4CR1Fq--Lb680rod5dbHWdvaAgeez079PtJZms00vIHuFRAppzLMF6YBCiS9xk0hLNt9uDzKizPpT7EpZKp1F16m2TJ_xQ3onD1'

     var messages = [];
     messages.push({
       notification: {title: 'Price drop', body: '5% off all electronics'},
       token: registrationToken,
     });
     
     admin.messaging().sendAll(messages)
       .then((response) => {
         console.log(response.successCount + ' messages were sent successfully');
       });
       res.send()
    
})



router.post('/User/notifications', userAuthorization, async(req, res)=>{
     const messages = [];
     const user = req.user
     try{
          const volunteers = await volunteer.find({enableCalls:true})
          // console.log('V1', volunteers.length)
          // console.log('V2', volunteers[1])
          user.room=req.body.room
          user.available=true
          await user.save()
          console.log(user)

          volunteers.forEach(Volunteer => {
               if(Volunteer.notificationToken){
                    //console.log('Volunteer', Volunteer)
               messages.push({
                    notification: {title: 'call received', body: 'you received call for help'},
                    token: Volunteer.notificationToken,
                    data: {room:req.body.room},
               });
               }
          })
          console.log(messages)
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

router.post('rateVolunteer', userAuthorization, async(req, res)=>{
     try{
          const user = req.user
          if(req.body.rate){
               const Volunteer = await volunteer.findById(user.volunteerID)
               Volunteer.rating = Volunteer.rating.concat({rate:req.body.rate,userID:user._id})
               await Volunteer.save()
          }
          user.volunteerID=''
          user.room=''
          user.available=true
          await user.save()
          res.send()
     }catch(error){
          console.log(error)
          res.status(500).send()
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