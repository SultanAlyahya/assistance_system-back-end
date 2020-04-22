require('./db/mongoose')
const express = require('express')
const blindUserRouter = require('./routers/blindUserRouter')
const volunteerRouter = require('./routers/volunteerRouter')
const adminRouter = require('./routers/adminRouter')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(blindUserRouter)
app.use(volunteerRouter)
app.use(adminRouter)


app.listen(port, ()=>{
    console.log('the server is up')
})

console.log('done')