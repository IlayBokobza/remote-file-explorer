const io = require('socket.io-client')
let index = 0
module.exports = (loopId) => {
    socket = io('ws://localhost:3000')
    console.log(socket.connected)
    if(socket.connected){
        return socket
    }else if(loopId && index === 10){
        clearInterval(loopId)

        if(socket.connected === false){
            console.log('Failed to connect to server')
            process.exit()
        }else{
            return socket
        }
    }

    
    if(loopId){
        console.log(`Attempt number ${index+1} to connected to server failed`)
        index++
    }
}