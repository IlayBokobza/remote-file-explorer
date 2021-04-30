const navigation = require('./navigation')
const fs = require('fs')
const os = require('os')
const path = require('path')
const axios = require('axios')

const socketEvents = (socket,userData) => {
    console.log(socket.id)
    //tells server you are client
    socket.emit('checkConnection',userData.id,() => {
        axios.default.post('http://localhost:3000/api/client',{
            name:userData.name,
            code:userData.id,
            socketId:socket.id,
            _id:userData._id,
        }).then(res => {
            const dataFilePath = path.resolve(os.homedir(),'./Documents/connect/data.json')
            const fileData = JSON.parse(fs.readFileSync(dataFilePath).toString())

            //adds id
            fileData._id = res.data._id

            fs.writeFileSync(dataFilePath,JSON.stringify(fileData))
        }).catch(err => {
            console.log(err.data)
        })
    })
    
    socket.on('message',(msg) => {
        console.log(msg)
    })

    socket.on('getDrives',(adminId) => {
        console.log('Sending drives to server.')
        socket.emit('sentDrives',navigation.getDrives(),adminId)
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