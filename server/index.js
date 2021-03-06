const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')
const socketIo = require('socket.io')
require('dotenv').config()

//start express
const app = express()
const server = http.createServer(app)

//confing express to parse json and to allow cors
app.use(express.json())

//config cors
const allowedUrls = ['localhost:3000','localhost:8080','connect.ilaydev.com']
app.use(cors({
    origin:allowedUrls
}))

//start socket
const io = socketIo(server,{
    cors:{
        origin:'*'
    }
})

//connect to db
require('./utils/db')

//sets socket events and user route
require('./utils/socket')(io)
app.use(require('./routes/user'))
app.use(require('./routes/client'))

//port for prod and dev
const port = process.env.PORT || 3000

//get client app route
app.get('/files/client-software',(req,res) => {
    res.sendFile(path.resolve(__dirname,'./utils/connect-client.exe'))
})

//serves app
const prodPath = `${__dirname}/dist`
app.use(express.static(prodPath))
app.get(/.*/,(req,res) => {
    res.sendFile(`${prodPath}/index.html`)
})

//listens for port (3000 for dev)
server.listen(port,() => {
    console.log(`Runing on port ${port}`)
})