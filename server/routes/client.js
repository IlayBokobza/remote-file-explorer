const router = require('express').Router()
const User = require('../utils/userModel')

//connect client
router.post('/api/client',async (req,res) => {
    try{
        const user = await User.findOne({code:req.body.code})

        if(!user){
            res.status(404).send({error:'No user with that code was found.'})
        }

        //checks if computer is already in db
        if(req.body._id){
            const computerIndex = user.computers.findIndex(pc => `${pc._id}` === req.body._id)

            if(computerIndex === -1){
                return res.status(404).send({error:'No computer with this id is connected to your account.\n Try entering the code again.'})
            }

            user.computers[computerIndex].socketId = req.body.socketId
        }else{
            user.computers.push({
                name:req.body.name,
                socketId:(req.body.socketId) ? req.body.socketId:null
            })
        }
        
        await user.save()
        res.status(201).send({_id:user.computers[user.computers.length-1]._id})
    }catch(error){
        res.status(500).send({error:`${error}`})
    }
})

module.exports = router