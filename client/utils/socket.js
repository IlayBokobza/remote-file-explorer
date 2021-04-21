const navigation = require('./navigation')
const fs = require('fs')
const socketEvents = (socket) => {
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
        const file = navigation.getFile(path)
        
        if(file?.sliced){
            file.data.forEach(slice => {
                socket.emit('sentSlice',slice)
            })
        }else{
            socket.emit('sentFile',file)
        }

    })

    //save file
    socket.on('saveFile',(file) => {
        fs.writeFileSync(file.path,`${file.data}`)
        console.log(`Saving File ${file.path}`)
    })
}

module.exports = socketEvents