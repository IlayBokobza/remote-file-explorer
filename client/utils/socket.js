const navigation = require('./navigation')
const fs = require('fs')
const os = require('os')
const path = require('path')
const axios = require('axios')
const {getIp} = require('./serverIp')
const sliceString = require('./sliceData')

const socketEvents = (socket,userData) => {
    //tells server you are client
    socket.emit('checkConnection',userData.id,(err) => {
        //checks for error
        if(err?.error){
            console.log(error)
            process.exit()
        }

        let url = null
        let selectedIp = getIp()
        if(selectedIp === 'connect.ilaydev.com'){
            url = 'https://connect.ilaydev.com'
        }else{
            url = `http://${selectedIp}`
        }

        axios.post(`${url}/api/client`,{
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
            console.log('Connected to server')
        }).catch(err => {
            console.log(err.response.data.error)
            process.exit()
        })
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
        
        file.forEach(slice => {
            socket.emit('sentSlice',slice)
        })

    })

    //when server asks for a big file
    socket.on('sendBigFile',(filePath) => {
        const file = fs.readFileSync(filePath).toString('base64')
        const slicedFile = sliceString(file)

        slicedFile.forEach(slice => {
            socket.emit('sentFileSlice',slice)
        })
    })

    //save file
    socket.on('saveFile',(file) => {
        fs.writeFileSync(file.path,`${file.data}`)
        console.log(`Saving File ${file.path}`)
    })
}

module.exports = socketEvents