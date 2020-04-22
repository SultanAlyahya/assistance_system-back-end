const express = require('express')
const admin = require('../db/Schemas/Admin')
const authorization = require('../middleware/middleware')
const volunteer = require('../db/Schemas/volunteer')


const router = express.Router()

router.post('/Admin/Signup', async(req, res)=>{
     console.log('in')
     
     
          const Admin = new admin(req.body)
          await Admin.genrateTokens()
          try{
               console.log(Admin)
               await Admin.save()
               console.log('in3')
               res.set('token', Admin.token)
               res.status(201).send(Admin)
          }catch(error){
               res.status(500).send(error.message)
          }
  })

router.post('/Admin/Login', async(req, res)=>{
     
     try{    
          const Admin = await admin.validateCredentials(req.body.email, req.body.password)
          if(Admin){
               await Admin.genrateTokens()
               res.set({'token': Admin.token,
               "Accept": "application/json"})
               res.status(200).send(BlindUser)
         }else{
              res.status(404).send()
         }
        
   }catch(error){
        res.status(500).send({"error":error.message})
   }
})

router.get('/User', async(req, res)=>{
     console.log(req.user)
     res.send()
})

router.post('/User/Logout', async(req, res)=>{
     const user = req.user
     user.token = ''
     user.save()
     res.send('done')
})

router.post('/Admin/Volunteer', async(req, res)=>{
     try{
          const Volunteers = await volunteer.find({})
          volunteers=[]
          for(var i=0;i<Volunteers.length;i++){
               const statistics = await Volunteers[i].volunteer()
               console.log(statistics)
               volunteers.push(statistics)
          }
          // const statistics = await Volunteers[0].volunteer()
          // console.log(statistics)
          // for(var i=0;i<Volunteers.length;i++){
          //      const V = Volunteers[i]
          //      console.log(V)
          //      Volunteers.push(V.volunteer())
          // }
          //console.log(volunteers)
          res.send(volunteers)
     }catch(error){
          console.log(error)
          res.status(500).send()
     }
})





module.exports = router