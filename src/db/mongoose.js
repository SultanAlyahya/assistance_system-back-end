const mongoose = require('mongoose')
const collectionName = 'Blind_people_assistance_system'
const atlasConnectionString = 'mongodb+srv://sultan12:14231423az@projects-eqika.mongodb.net/'+collectionName+'t?retryWrites=true&w=majority'
try{
mongoose.connect(atlasConnectionString, {
    useNewUrlParser:true, 
    useUnifiedTopology: true,
    useCreateIndex:true
})
}catch(error){
    console.log(error);
    
}
