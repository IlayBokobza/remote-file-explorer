let client = null
let admin = null
const socketEvents = (io) => {
    io.on('connection',socket => {
        console.log('someone connected to server')
        socket.emit('message','Successfully connected to server.')

        //sets client id
        socket.on('setClient',() => {
            client = socket.id
            console.log(`Successfully set client's id to "${client}"`)
        })

        //sets admin id
        socket.on('setAdmin',() => {
            admin = socket.id
            console.log(`Successfully set admin's id to "${admin}"`)
        })

        //gets drive
        socket.on('getDrives',() => {
            socket.to(client).emit('getDrives')
        })

        //when the client sends back the drives
        socket.on('sentDrives',(drives) => {
            console.log('Recived drives from client.',drives)
            socket.to(admin).emit('sentDrives',drives)
        })

        //get dir from client
        socket.on('getDir',(path) => {
            socket.to(client).emit('getDir',path)
        })

        //when client sends back the dir
        socket.on('sentDir',(data) => {
            console.log('Recived dir data from client.')
            socket.to(admin).emit('sentDir',data)
        })

        //get file from client
        socket.on('getFile',(path) => {
            socket.to(client).emit('getFile',path)
        })

        //when client sends
        socket.on('sentFile',(file) => {
            socket.to(admin).emit('sentFile',file)
        })
    })
}

module.exports = socketEvents