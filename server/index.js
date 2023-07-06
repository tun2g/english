const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")
const createError = require("http-errors")

const db = require('./configs/mongo.config');
const corsConfig = require("./configs/cor.config");
const corsMiddleware= require("./middlewares/cors.m") 
const socket = require("./services/socket/index")
const logEvent = require("./helpers/log")

require("dotenv").config();
db.connect()

const app = express()
const server = http.createServer(app)
socket(server)

app.use(cors(corsConfig)) 
app.use(corsMiddleware)
app.use(helmet())
app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

require("./routes/index")(app);

// app.use('/',(req,res)=>{
//     res.json("hello world")
// })

app.use((req,res,next)=>{
    next(createError(404,"Not Found"))
})

app.use((err,req,res,next)=>{
    logEvent(`route: ${req.url}----method: ${req.method}----${err.message}`)
    res.status(err.status||500).json({
        status:err.status || 500,
        message:err.message,
    })
})

server.listen(3000,()=>{
    console.log("Server is running on Port","3000")
})