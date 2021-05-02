const socketEvents = require('./utils/socket')
const {getIp} = require('./utils/serverIp')
const getUserData = require('./utils/getUserData')

//get data
getUserData().then((userData) => {
    //sets domain to ip so can connect
    let ip = null
    if(getIp() === 'connect.ilaydev.com'){
        ip = '207.154.230.135:80'
    }else{
        ip = getIp()
    }

    //connect to server
    const socket = require('socket.io-client')(`http://${ip}`,{
        ransports: ["websocket"]
    })
    console.log(`Connecting to ${getIp()}`)

    //checks for connection errors
    socket.on('connect_error',(err) => {
        console.log(err);
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