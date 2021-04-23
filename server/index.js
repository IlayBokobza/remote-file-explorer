const express = require('express')
const http = require('http')
const cors = require('cors')
const socketIo = require('socket.io')

//start express
const app = express()
const server = http.createServer(app)

//confing express to parse json and to allow cors
app.use(express.json())

//config cors
const allowedUrls = ['localhost:3000','localhost:8080','connectapp.ilaydev.com']
app.use(cors({
    origin:allowedUrls
}))

//start socket
const io = socketIo(server,{
    cors:{
        origin:allowedUrls
    }
})

//connect to db
require('./utils/db')

//sets socket events and user route
require('./utils/socket')(io)
app.use(require('./utils/userRoutes'))

//port for prod and dev
const port = process.env.PORT || 3000

//serves socket testing
app.get('/api/socket-testing',(req,res) => {
    res.sendFile(__dirname+'/utils/scoketTesting.html')
})

//listens for port (3000 for dev)
server.listen(port,() => {
    console.log(`Runing on port ${port}`)
})