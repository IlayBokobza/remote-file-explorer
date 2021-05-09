module.exports = (data,size = 0) => {
    const sliceNum = (Math.round(size/400000) > 0) ? Math.round(size/400000) : 1
    
    let output = []
    let starting = 0
    let end = data.length/sliceNum

    for(let index = 0;index < sliceNum;index++){
        output.push(data.slice(starting,end))
        end += data.length/sliceNum
        starting += data.length/sliceNum
    }

    //add slices num to start
    output[0] = '{'+sliceNum+'}' + output[0]
    return output
}