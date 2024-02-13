const express = require('express');
const mongoose = require('mongoose')
const cors = require("cors")
const morgan = require("morgan");
const router = require('./route');
require("dotenv").config()

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.use("/api",router)

mongoose.connect(process.env.DB_URI,{dbName:"Sati"}).then(()=>{
    console.log("Database Is Connected")
    app.listen(PORT,()=>{
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
        console.log(`Server is Running on port http://localhost:${PORT} -3-`)
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
    })
}).catch((err) => {
    console.log(err)
});