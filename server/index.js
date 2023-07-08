const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")

const db = require('./configs/mongo.config');
const corsConfig = require("./configs/cor.config");
const corsMiddleware= require("./middlewares/cors.m") 
const socket = require("./services/socket/index")
const errorMiddleware = require("./middlewares/error.m")
require("dotenv").config();
db.connect()

const PORT = process.env.PORT || 8080

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

app.use(errorMiddleware)

server.listen(PORT,()=>{
    console.log("Server is running on Port",PORT)
})