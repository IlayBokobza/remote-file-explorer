const express = require('express')
const http = require('http')
const cors = require('cors')

//start express
const app = express()
const server = http.createServer(app)

//confing express to parse json and to allow cors
app.use(express.json())
app.use(cors())

//start socket
const socketIo = require('socket.io')
const io = socketIo(server,{
    cors:{
        origin:'*'
    }
})
//sets socket events
require('./utils/socket')(io)


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