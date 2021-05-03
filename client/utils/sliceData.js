module.exports = (data = '') => {
    let output = []
    let starting = 0
    let end = data.length/5

    for(let index = 0;index < 5;index++){
        output.push(data.slice(starting,end))
        end += data.length/5
        starting += data.length/5
    }

    return output
}