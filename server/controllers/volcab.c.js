const Volcab = require('../models/volcab.m') 

const VolcabController = {
    addNew:async(req,res,next)=>{
        try {
            /**
             * eng   vnese  exp  note  
             * 
             */
            const {eng,vnese} =req.body
            const volcab = new Volcab({eng,vnese,...req.body})
            await volcab.save()
            res.status(201).json({
                status:201,
                message:"Created sucessfully."
            })
        } catch (error) {
            next(error)
            console.log(error)
        }
    },
    update:async(req,res,next)=>{
        try {
            const {_id,creater} = req.body
            const updateVolcab = await Volcab.findOneAndUpdate({_id},{$set:{...req.body}})

            if(!updateVolcab){
                res.status(500).json({
                    status:500,
                    message:"Volcab Not Found."
                })
            }
            else {
                res.status(200).json({
                    status:200,
                    message:"Updated sucessfully."
                })
            }
        } catch (error) {
            next(error)
            console.log(error)
        }
    },    
    getVolByUser:async(req,res,next)=>{
        try {
            const creater = req.params
            const {_id} = req.body
            const listVolcabs = await Volcab.find({creater,_id})
            if(!listVolcabs){
                res.json({
                    status:500,
                    message:"User or Volcab not found."
                })
            }
            else {
                res.status(200).json({
                    status:200,
                    message:"send list",
                    list:listVolcabs
                })
            }
        } catch (error) {
            next(error)
            console.log(error)
        }
    },
    getAll:async(req,res,next)=>{
        try {
            const listVolcabs = await Volcab.find()
            res.status(200).json({
                status:200,
                message:"send list",
                list:listVolcabs
            })
        } catch (error) {
            next(error)
            console.log(error)
        }
    },
}

module.exports = VolcabController