const readline = require('readline');
const os = require('os')
const fs = require('fs')
const path = require('path')

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

const getData = async () => {
    return new Promise(async (resolve,reject) => {
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