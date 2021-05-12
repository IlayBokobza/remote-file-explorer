const mongoose = require('mongoose')
const uri = process.env.MONGO_SRV


//connects to db
mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    dbName:'connectApp'
}).then(() => {console.log('connected db')}).catch(err => {console.log(err)})