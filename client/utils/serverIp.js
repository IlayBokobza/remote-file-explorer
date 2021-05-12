let ip = 'https://connect.ilaydev.com'

const turnOnDevMode = () => ip = 'http://localhost:3000'
const getIp = () => ip

module.exports = {
    turnOnDevMode,
    getIp,
}