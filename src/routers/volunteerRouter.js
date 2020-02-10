const express = require('express')
const volunteer = require('../db/Schemas/volunteer')


const router = express.Router()

router.post('/volunteer/Signup', async(req, res)=>{
    
    const newVolunterr = new volunteer(req.body)
    try{
        await newVolunterr.save()
        res.status(201).send(newVolunterr)
    }catch(error){
        res.status(500).send()
    }
})

router.post('/volunteer/Login', async(req, res)=>{
    try{
        const Volunteer = await volunteer.find(req.body)
        if(Volunteer){
            res.send(Volunteer)
        }else{
            res.status(404).send()
        }
    }catch(error){
        res.status(500).send()
    }
})

module.exports = router