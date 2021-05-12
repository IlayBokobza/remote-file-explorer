const socketEvents = require('./utils/socket')
const {getIp} = require('./utils/serverIp')
const getUserData = require('./utils/getUserData')

//get data
getUserData().then((userData) => {
    //gets ip/domain
    let ip = getIp()

    //connect to server
    const socket = require('socket.io-client')(ip,{transports: ['polling','websocket']})
    console.log(`Connecting to ${ip}`)

    //checks for connection errors
    socket.on('connect_error',(err) => {
        console.log(err.message);
    })

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