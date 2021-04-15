const fs = require('fs')

const getDrives = () => {
    const letters = JSON.parse(fs.readFileSync(__dirname+'/lettter.json').toString())
    const doesExist = []
    
    //checks all letters and if drive exist add to array
    letters.forEach(letter => {
        if(fs.existsSync(`${letter}:/`)){
            doesExist.push(`${letter}:`)
        }
    })
    return doesExist
}

const getDir = (path) => {
    if(!fs.existsSync(path)){
        return {Error:'Path Does Not Exist'}
    }

    const dirData = fs.readdirSync(path)

    //create data
    let output = dirData.map((item,index) => {
        try {
            const itemData = fs.statSync(`${path}/${item}`)
            return {
                name:item,
                isDir:itemData.isDirectory()
            }
        } catch(err) {
            return null
        }
    })
    

    //remove errored items
    output = output.filter(item => item != null)

    return output
}

module.exports = {
    getDrives,
    getDir,
}