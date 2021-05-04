let ip = 'connect.ilaydev.com'

const turnOnDevMode = () => ip = 'localhost:3000'
const getIp = () => ip

module.exports = {
    turnOnDevMode,
    getIp,
}