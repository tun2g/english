const Volcab = require('../models/volcab.m') 
const redis = require('../configs/redis.config')

const VolcabController = {
    addNew:async(req,res,next)=>{
        try {
            /**
             * eng   vnese  exp  note  
             * 
             */
            await redis.set("a","1")

            const {eng,vnese} =req.body
            const {error} =  Volcab.schema.methods.validateInput(req.body)
            if(error){
                console.log(error)
                next(error)
            }
            else{
                const volcab = new Volcab({eng,vnese,...req.body})
                await volcab.save()
                res.status(201).json({
                    status:201,
                    message:"Created sucessfully."
                })
            }
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
    deleteByUser:async(req,res,next)=>{
        try {
            const {creater,_id} = req.body
            console.log(_id)
            const {error} = await Volcab.findOneAndDelete({_id})
            if(error){
                console.log(error)
                res.status(500).json({
                    status:500,
                    message:"Volcaab not found"
                })
            }
            else {
                res.status(200).json({
                    status:200,
                    message:"Deleted"
                })
            }
        } catch (error) {
            console.log(error)
            next(error)
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

    getPagination:async(req,res,next)=>{
        try {
            const perPage= parseInt(req.query.perpage) || 6
            const page = parseInt(req.query.page) || 1
            
            const list = await Volcab.aggregate([
                {
                    $skip : (page-1)*perPage
                },
                {
                    $limit:perPage
                }
            ])
            res.status(200).json({
                status:200,
                message:"send list",
                list
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    //random ->10
    getRandomVolcabs:async(req,res,next)=>{
        try {
            const {creater} = req.body
            const number =parseInt(req.query.number) || 3

            const listDb = (await Volcab.find().sort({_id:-1})).map((e)=>{
                return {...e._doc,priority:0}
            })  

            
            /** lấy danh sách list 
             * random 10 ngẫu nhiên trong list
             * lưu trạng thái: userid, volid (set redis expire time)  => lưu ở đâu ?
             * sắp xếp
             * lấy ra số phần tử
             */

            //tạm thời set list
            let listRead =  await redis.get('list', (err, reply) => {
                if (err) {
                  console.error(err);
                  next(err)
                } else {
                  return JSON.parse(reply);
                }
            }) || []

            if(typeof listRead === "string"){
                listRead = JSON.parse(listRead)
            }
            // list = [ { userid , volid , pritority } , {  }]

            const priorityZero  = listDb.length - listRead.length
            
            
            for(let i =0; i <listRead.length;++i){                //  [{} {}]
                for(let j = 0 ;j <listDb.length;++j){             //  [{} {} {} {} {}]
                    if(JSON.stringify(listRead[i].volId)  === JSON.stringify(listDb[j]._id)){
                        
                        // thay đổi độ ưu tiên trong listDb
                        listDb[j].priority = listRead[i].priority
                        break;
                    }
                }
            }
            
            let listZero=listDb.filter((e)=>e.priority === 0)
            let result

            if(priorityZero >= number){
                // random trong các từ chưa đọc từ listZero
                // listZero là mảng đã xếp theo _id
                // random một mảng mới với _id đã sắp xếp sẵn
                result = listZero.sort(() => 0.5 - Math.random()).slice(0, number);
                result = result.sort((a, b) => a._id - b._id)

                //cập nhật trong redis (cập nhật lại mảng listRead)
                //các phần tử này chưa có trong listRead 
                //=> thêm vào đầu (chắc chắn độ ưu tiên đã là nhỏ nhất)
                for(let i =0; i <number;++i){
                    listRead.unshift({creater:"",volId:result[i]._id,priority:1,eng:result[i].eng})
                }

                listRead = listRead.sort((a,b)=>a._id - b._id)

                await redis.set("list",JSON.stringify(listRead))
                await redis.expire("list",10*60)
            }
            else {
                // tìm ra các từ có độ ưu tiên nhỏ nhất trong các từ còn lại trong mảng listRead
                // listZero 
                // number > listZero.length
                // listDb đang xếp theo _id
                result = listDb.sort((a,b)=>a.priority - b.priority).slice(0,number)
                result = result.sort((a,b)=>a._id - b._id)

                // update lại listRead
                for(let i = 0;i<number;++i){
                    const index = listRead.findIndex((e)=> JSON.stringify(e.volId) === JSON.stringify(result[i]._id))
                    if(index >= 0){
                        listRead[index].priority+=1
                    }
                    else {
                        listRead.push({creater:"",priority:1,volID:result[i]._id,eng:result[i].eng})
                    }
                }

                //xếp lại theo _id
                listRead = listRead.sort((a,b)=>a._id - b._id)

                await redis.set("list",JSON.stringify(listRead))
                await redis.expire("list",10*60)
            }
            
            //gửi đến client
            res.status(200).json({
                status:200,
                message:"send list",
                list:result
            })            

        } catch (error) {
            next(error)
            console.log(error)
        }
    },
    getListByQuery:async(req,res,next)=>{
        try {
            const list = await Volcab.find(req.query)
            if(list){
                res.status(200).json({
                    status:200,
                    messgae:"send list",
                    list
                })
            }
            else {
                res.status(500).json({
                    status:500,
                    message:"page not found"
                })
            }
        } catch (error) {
            next(error)
            console.log(error)      
        }
    },

}

module.exports = VolcabController