const cron = require("node-cron")
const router = require("express").Router()
const Data = require("./models/Data")

let datas = {
    device1:[0],
    device2:[0],
    device3:[0],
    device4:[0],
}

let temp_date = [0]
let humi_data = [0]

cron.schedule("* * * * *",()=>{
    console.log("Hi Minute")
    // avg
    avg = (datas.device1.slice(-1)[0] + datas.device2.slice(-1)[0] + datas.device3.slice(-1)[0] + datas.device4.slice(-1)[0])/4
    // create data base
    Data.create({
        humidity:humi_data.slice(-1)[0],
        temperature:temp_date.slice(-1)[0],
        soli_moisture:avg
    })
    // reset value
    temp_date = [0]
    humi_data = [0]
    datas = {
        device1:[0],
        device2:[0],
        device3:[0],
        device4:[0],
    }
})

router.get("/send",(req,res)=>{
    avg = (datas.device1.slice(-1)[0] + datas.device2.slice(-1)[0] + datas.device3.slice(-1)[0] + datas.device4.slice(-1)[0])/2
    res.status(200).json({
        humidity:humi_data.slice(-1)[0],
        temperature:temp_date.slice(-1)[0],
        soli_moisture:avg,
        time:new Date().toLocaleTimeString(),
        date:new Date().toLocaleDateString(),
    })
})

router.post("/recv", (req,res)=>{
    const {soil_moisture, temperature, humidity, device} = req.body
    datas[device].push(soil_moisture)
    if(device === "device1"){
        temp_date.push(temperature)
        humi_data.push(humidity)
    }
    res.json()
})

module.exports = router