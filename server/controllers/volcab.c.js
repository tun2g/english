const createError= require('http-errors')

const volcabController = {
    get:async(req,res,next)=>{
        try {
            res.json("hello",a)
        } catch (error) {
            next(createError(error.status||500,error.message))
            
        }
    }    
}

module.exports = volcabController