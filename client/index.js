// const navigation = require('./utils/navigation')
// const connectToServer = require('./utils/connectToServer')
// const socketEvents = require('./utils/socket')
// let socket = null

// //connects to server
// connectToServer()
// const loopId = setInterval(()=>{
//     socket = connectToServer(loopId)

//     if(socket){
//         socketEvents(socket)
//     }
// },1000)

const io = require('socket.io-client')
// const fs = require('fs')
const socket = io('ws://localhost:3000')
console.log(socket)