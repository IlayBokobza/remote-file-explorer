const mongoose = require('mongoose')
// const os = require('os')
// require('dotenv').config()

let uri = process.env.MONGO_SRV

//switch between pord and dev
// if(os.hostname() == 'IlayBIgPc'){
//     uri = ''
// }else{
//    uri = process.env.MONGODBKEY
//
// }

//connects to db
mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    dbName:'connectApp'
}).then(() => {console.log('connected db')}).catch(err => {console.log(err)})