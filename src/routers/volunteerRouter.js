const express = require('express')
const volunteer = require('../db/Schemas/volunteer')

const router = express.Router()

router.post('/volunteer', async(req, res)=>{
    const newVolunterr = new volunteer(req.body)
    try{
        await newVolunterr.save()
        res.status(201).send(newVolunterr)
    }catch(error){
        res.status(500).send({error:'the is a problem'})
    }
})

router.get('/volunteer', async(req, res)=>{
    const v =await volunteer.find({})
    
    res.send(v)
})

module.exports = router