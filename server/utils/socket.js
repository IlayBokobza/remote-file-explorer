const User = require('./userModel')
const jwt = require('jsonwebtoken')
const socketEvents = (io) => {
    io.on('connection',(socket) => {
        //connetion vars
        let me = null //should be 'admin' or 'client'
        let client = null
        let admin = null
        let user = null
        let code = null

        socket.emit('message','Successfully connected to server.')

        //make client online
        socket.on('checkConnection',(userCode,cb) => {
            client = socket.id
            me = 'client'
            code = userCode

            if(!userCode){
                return cb({error:'No code'})
            }

            cb()
        })

        //sets admin id
        socket.on('setAdmin',async (token,cb) => {
            try {
                const decoded = jwt.verify(token,'secretTokenKey')
                user = await User.findOne({ _id: decoded._id, 'tokens.token':token })
    
                if(!user){
                    return cb({error:'No user Found'})
                }
                
                admin = socket.id
                me = 'admin'
                console.log(`Successfully added an admin`)
            } catch (error) {
                console.log(error)
            }
        })

        //sets client
        socket.on('selectClient',(clientDbId,cb) => {
            if(!user){
                return cb({error:'Error please try again'})
            }

            const copmuterIndex = user.computers.findIndex(pc => `${pc._id}` === clientDbId)

            if(copmuterIndex === -1){
                return cb({error:'No pc with that id was found.'})
            }

            const computer = user.computers[copmuterIndex]

            if(!computer.socketId){
                return cb({error:'Computer not connected'})
            }

            client = computer.socketId
            console.log('a client was selected')
        })

        //gets drive
        socket.on('getDrives',() => {
            socket.to(client).emit('getDrives',admin)
        })

        //when the client sends back the drives
        socket.on('sentDrives',(drives,adminId) => {
            admin = adminId
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

        //when client sends file
        socket.on('sentFile',(file) => {
            socket.to(admin).emit('sentFile',file)
        })

        //when sent slice
        socket.on('sentSlice',(slice) => {
            socket.to(admin).emit('sentSlice',slice)
        })

        //save file
        socket.on('saveFile',(file) => {
            socket.to(client).emit('saveFile',file)
        })

        //when the scocket disconnects
        socket.on('disconnect',async () => {
            if(me === 'client'){
                try {
                    console.log('here')
                    const user = await User.findOne({code})
                    
                    if(!user){
                        return
                    }
                    
                    //make client ofline
                    const pcIndex = user.computers.findIndex(pc => pc.socketId = client)
    
                    if(pcIndex === -1){
                        return
                    }
    
                    user.computers[pcIndex].socketId = null
                    await user.save()

                    if(admin){
                        socket.to(admin).emit('clientDisconnectd')
                    }
    
                    console.log('Disconnected User')
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
}

module.exports = socketEvents