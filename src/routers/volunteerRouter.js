const express = require('express')
const volunteer = require('../db/Schemas/volunteer')

const router = express.Router()

router.post('/volunteer', async(req, res)=>{
    const newVolunterr = new volunteer(req.body)
    try{
        await newVolunterr.save()
        res.status(201).send(newVolunterr)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router