const mongoose = require('mongoose')
const collectionName = 'Blind_people_assistance_system'
const atlasConnectionString = 'mongodb+srv://sultan12:14231423az@projects-eqika.mongodb.net/'+collectionName+'?retryWrites=true&w=majority'

mongoose.connect(atlasConnectionString, {
    useNewUrlParser:true, 
    useUnifiedTopology: true,
    useCreateIndex:true
})
