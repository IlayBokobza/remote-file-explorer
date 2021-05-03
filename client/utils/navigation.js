const fs = require('fs')
const sliceString = require('./sliceData')

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

    let dirData = null

    try {
        dirData = fs.readdirSync(path)
    } catch (error) {
        console.log(error.code)
        return JSON.stringify(error)
    }

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

const getFile = (path) => {
    if(!fs.existsSync(path)){
        return {Error:'Path Does Not Exist'}
    }
    
    let file = null

    try {
        file = fs.readFileSync(path)
    } catch (error) {
        console.log(error.code)
        return JSON.stringify(error)
    }
    
    const fileName = path.replace(/^.*[\\\/]/, '')

    if(checkFileType(['png','jpeg','jpg'],fileName)){
        const fileData = file.toString('base64')
        return {
            sliced:true,
            data:sliceString(fileData)
        }
    }

    return file.toString()
}

const checkFileType = (extensions = [],fileName) => {
    let startPartten = '.('
    let endPartten = ')$'

    extensions.forEach((extension,index) => {
        startPartten += extension

        if(index !== extensions.length-1){
            startPartten += '|'
        }
    })

    const parrten = startPartten + endPartten
    const regex = new RegExp(parrten,'i')

    return regex.test(fileName)
}

module.exports = {
    getDrives,
    getDir,
    getFile,
    checkFileType,
}