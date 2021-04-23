const mongoose = require('mongoose')
const os = require('os')
// require('dotenv').config()

let uri = null

//switch between pord and dev
if(os.hostname() == 'IlayBIgPc'){
    uri = 'mongodb+srv://illay:321123@atra.kqmib.mongodb.net/shop?retryWrites=true&w=majority'
}else{
    // uri = process.env.MONGODBKEY
    uri = 'mongodb+srv://illay:321123@atra.kqmib.mongodb.net/shop?retryWrites=true&w=majority'
}

//connects to db
mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    dbName:'connectApp'
}).then(() => {console.log('connected db')}).catch(err => {console.log(err)})