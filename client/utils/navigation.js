const fs = require('fs')
const sliceString = require('./sliceData')

const noPreview = ['bpm','tiff','psd','xls','doc','docx','odt','zip','rar','7z','tar',
'iso','mdb','accde','frm','sqlite','exe','dll','so','class','jar','dat','ttf','tte','ico','vmdk','vmsd',
'vmx','vmxf','nvram','wt','bson','mdmp']

const getDrives = () => {
    const letters = require('./lettter')
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
    let fileSize = null

    try {
        file = fs.readFileSync(path)
        fileSize = fs.statSync(path).size
    } catch (error) {
        console.log(error.code)
        return JSON.stringify(error)
    }
    
    const fileName = path.replace(/^.*[\\\/]/, '')

    if(checkFileType([...noPreview,'png','jpeg','jpg'],fileName)){
        file = file.toString('base64')
    }else{
        file = file.toString()
    }

    return sliceString(file,fileSize)
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