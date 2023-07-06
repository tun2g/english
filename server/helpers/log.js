const fs = require("fs").promises
const path = require("path")
const {format} = require('date-fns')

const fileName = path.join(__dirname,'../Logs','logs.log')

const logEvent = async (msg)=>{
    const dataTime = `${format(new Date(),'dd-MM-yyy\tHH:mm:ss')}`
    const contentLog= `${dataTime}----${msg}\n`
    try {
        fs.appendFile(fileName,contentLog)
    } catch (error) {
        console.log(error)
    }
}

module.exports = logEvent