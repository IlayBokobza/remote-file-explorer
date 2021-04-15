const express = require('express')
const app = express()

//set up json
app.use(express.json())

const port = process.env.PORT || 3000
app.listen(port,() => console.log(`Runing on port ${port}`))
