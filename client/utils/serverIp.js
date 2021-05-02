const fs = require('fs')

const writeFile = (data) => {
    fs.writeFileSync(`${__dirname}/ip.txt`,data)
}

const turnOnDevMode = () => writeFile('localhost:3000')
const getIp = () => fs.readFileSync(`${__dirname}/ip.txt`).toString()

writeFile('connect.ilaydev.com')

module.exports = {
    turnOnDevMode,
    getIp,
}