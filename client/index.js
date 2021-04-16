const io = require('socket.io-client')
const socket = io('ws://localhost:3000')
const navigation = require('./utils/navigation')

//tells server you are client
socket.emit('setClient')

socket.on('message',(msg) => {
    console.log(msg)
})

socket.on('getDrives',() => {
    console.log('Sending drives to server.')
    socket.emit('sentDrives',navigation.getDrives())
})

socket.on('getDir',(path) => {
    console.log(`Sending directory "${path}" to server.`)
    socket.emit('sentDir',navigation.getDir(path))
})

socket.on('getFile',(path) => {
    console.log(`Sending file "${path}" to server.`)
    socket.emit('sentFile',navigation.getFile(path))
})