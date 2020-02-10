const express = require('express')
const volunteer = require('../db/Schemas/volunteer')


const router = express.Router()

router.post('/volunteer/Signup', async(req, res)=>{
    try{
    const isAvailable = await volunteer.isAvailable({email:req.body.email})
    if(isAvailable){
        const newVolunterr = new volunteer(req.body)
        
        
            await newVolunterr.save()
            res.status(201).send(newVolunterr)
       
    }else{
        res.status(501).send({error:'the email has been used'})
    }
    }catch(error){
        res.status(500).send(error.message)
}
})

router.post('/volunteer/Login', async(req, res)=>{
        try{
            const Volunteer = await volunteer.validateCredentials(req.body.email, req.body.password)
            if(Volunteer){
                res.send(Volunteer)
            }else{
                res.status(404).send()
            }
        }catch(error){
            console.log(error)
            res.status(500).send(error.message)
        }
    
})

module.exports = router