const logEvent = require('../helpers/log')

const errorMiddleware = (err,req,res,next)=>{
    logEvent(`route: ${req.url}----method: ${req.method}----${err.message}`)
    res.status(err.status||500).json({
        status:err.status || 500,
        message:err.message,
    })
}

module.exports = errorMiddleware