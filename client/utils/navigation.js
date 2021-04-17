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

const getFile = (path) => {
    if(!fs.existsSync(path)){
        return {Error:'Path Does Not Exist'}
    }

    const file = fs.readFileSync(path)
    const fileName = path.replace(/^.*[\\\/]/, '')

    if(checkFileType(['png','jpeg','jpg'],fileName)){
        return file.toString('base64')
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

getFile('C:/Users/Ilay/Pictures/terriaBackround1.jpg')

module.exports = {
    getDrives,
    getDir,
    getFile,
    checkFileType,
}