const socketEvents = require('./utils/socket')
let socket = require('socket.io-client')('ws://localhost:3000')
const getUserData = require('./utils/getUserData')

//get data
getUserData().then((userData) => {
    // call socket events
    socketEvents(socket,userData)

    // wait 10 sec to check if connected
    setTimeout(() => {
        if(!socket.connected){
            console.log('Failed to connect to server :(')
            process.exit()
        }
    },10000)
})