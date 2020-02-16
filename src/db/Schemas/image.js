const mongoose = require('mongoose')

const imgaeSchema = mongoose.Schema({
    image:{
        data:Buffer,
        contentType: String
    }
})

const image = mongoose.model('Image', imgaeSchema)

module.exports = image