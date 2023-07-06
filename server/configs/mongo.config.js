const mongoose=require('mongoose')

mongoose.set('strictQuery', false);

async function connect(){
    try{
        console.log(process.env.DB_URL)
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("mongo connected")
    }
    catch(err){
        console.log('mongo connect failed')
    }

}


module.exports={connect}