const readline = require('readline');
const os = require('os')
const fs = require('fs')
const path = require('path')
const {turnOnDevMode} = require('./serverIp')

//setup readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askToUseExistingData = () => {
    return new Promise(async (resolve,reject) => {
        rl.question('Do you want to use existing id? [y/n]\n',async (answer) => {
            if(answer === 'y' || answer === 'yes' || answer === ''){
                resolve(true)
            }else if(answer === 'n' || answer === 'no'){
                resolve(false)
            }else{
                const reAnswer = await askToUseExistingData()
                resolve(reAnswer)
            }
        })
    })
}

const askForDevMode = () => {
    return new Promise(async (resolve,reject) => {
        rl.question('Hello Ilay! Do you want to use dev mode? [y/n]\n',async (answer) => {
            if(answer === 'y' || answer === 'yes' || answer === ''){
                console.log('Ok using dev mode!')
                turnOnDevMode()
                resolve()
            }else if(answer === 'n' || answer === 'no'){
                console.log('Using prod.')
                resolve()
            }else{
                const reAnswer = await askForDevMode()
                resolve(reAnswer)
            }
        })
    })
}

const getData = async () => {
    return new Promise(async (resolve,reject) => {
        //checks the programs is running on my pc if so ask for dev mode
        if(os.hostname() === 'IlayBIgPc'){
            await askForDevMode()
        }

        const dataFolderPath = path.resolve(os.homedir(),'./Documents/connect')
        const dataFilePath = path.resolve(dataFolderPath,'./data.json')

        //checks if already gotten data
        if(fs.existsSync(dataFilePath)){
            const useExsitingData = await askToUseExistingData() 
            if(useExsitingData){
                rl.close()
                resolve(JSON.parse(fs.readFileSync(dataFilePath).toString()))
                return
            }
        }

        //asks user for id
        rl.question('What is you connect id?\n',(id) => {
            const userData = {
                name:os.hostname(),
                id,
            }

            //writes to file
            if(!fs.existsSync(dataFolderPath)){
                fs.mkdirSync(dataFolderPath)
            }
            fs.writeFileSync(dataFilePath,JSON.stringify(userData))

            //send back data
            rl.close()
            resolve(userData)
        })
    })
    
}

module.exports = getData