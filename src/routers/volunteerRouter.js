const express = require('express')
const volunteer = require('../db/Schemas/volunteer')
const {volunteerAuthorization} = require('../middleware/middleware')
const blindUser = require('../db/Schemas/blindUser')

const router = express.Router()



router.get('/noti', async(req, res)=>{
    try{
        console.log('in')
       noti()
       res.send()
    }catch(error){
        res.status(500).send(error.message)
}
})

router.get('/volunteer/getData', volunteerAuthorization, async(req, res)=>{
    try{
       
        const Volunteer = req.Volunteer
        const statistics = await Volunteer.statistics()
        res.send(statistics)


    }catch(error){
        res.status(500).send(error.message)
}
})

router.get('/volunteer', volunteerAuthorization, async(req, res)=>{
    try{
        const Volunteer = await volunteer.findById(req.Volunteer._id)
        if(Volunteer){
            res.send(Volunteer)
        
        }else{
            res.status(501).send({error:'user not found'})
        }
    }catch(error){
        res.status(500).send(error.message)
}
})

router.get('/volunteer/logout', volunteerAuthorization, async(req, res)=>{
    Volunteer = req.Volunteer
    try{
        Volunteer.token = ''
        Volunteer.notificationToken = ''
        await Volunteer.save()
        res.send()
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})


router.post('/volunteer/getCall', volunteerAuthorization, async(req, res)=>{
    const Volunteer = req.Volunteer
    try{
        console.log(Volunteer.enableCalls)
        res.send(Volunteer.enableCalls)
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})

router.post('/volunteer/joinRoom', volunteerAuthorization, async(req, res)=>{
    const Volunteer = req.Volunteer
    console.log(Volunteer)
    try{
        //console.log('room',req.body.room )
        const user =await  blindUser.findOne({room:req.body.room})
        console.log('user available',user.available)
        if(user.available){
            user.available=false
            user.volunteerID=Volunteer._id
            await user.save()
            Volunteer.calls = Volunteer.calls+1
            await Volunteer.save()
            console.log('user',user)
            res.send({available:true})
        }else{
            res.send({available:false})
        }
    }catch(error){
        console.log(error)
        res.status(500).send({available:false})
    }

})


router.post('/volunteer/Signup', async(req, res)=>{
    try{
        console.log(req.body)
    const isAvailable = await volunteer.isAvailable({email:req.body.email})
    if(isAvailable){
        const Volunteer = new volunteer(req.body)
        
        const token = await Volunteer.genrateTokens()
            await Volunteer.save()
            res.set({'token': token,
               "Accept": "application/json"})
            res.status(201).send(Volunteer)
    }else{
        res.status(501).send({error:'the email has been used'})
    }
    }catch(error){
        res.status(500).send(error.message)
}
})

router.post('/volunteer/Login', async(req, res)=>{
    
    console.log(req.body)
        try{
            const Volunteer = await volunteer.validateCredentials(req.body.email, req.body.password)
            if(Volunteer){
                Volunteer.notificationToken = req.body.notificationToken
                const token = await Volunteer.genrateTokens()

                const statistics = await Volunteer.statistics()

                res.set({'token': token,
               "Accept": "application/json"})
                res.send(statistics)
            }else{
                res.status(404).send()
            }
        }catch(error){
            console.log(error)
            res.status(500).send(error.message)
        }
    
})

router.get('/volunteer/loginByToken', volunteerAuthorization, async(req, res)=>{
    try{
        const Volunteer = req.Volunteer
        const statistics = await Volunteer.statistics()
        res.send(statistics)
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})

router.post('/volunteer/notificationToken',(req, res)=>{
    console.log(req.body.token)
    res.send()
})

router.patch('/volunteer/updateData', volunteerAuthorization, async(req, res)=>{
try{
    const availableChanges = ['password', 'email', 'name']
const chnages = Object.keys(req.body)
const available = chnages.every((change=>availableChanges.includes(change)))
if(available){
   const Volunteer = await volunteer.findById(req.Volunteer._id)
   chnages.forEach(change => Volunteer[change] = req.body[change])
   await Volunteer.save()
   res.send(Volunteer)
}else{
    res.status(400).send()
}
}catch(error){
    res.send(error)
}
})

router.patch('/volunteer/toggleCalls', volunteerAuthorization, async(req, res)=>{
    const Volunteer = req.Volunteer
    try{
        Volunteer.enableCalls = !Volunteer.enableCalls
        await Volunteer.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

module.exports = router