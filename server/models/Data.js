const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    soil_moisture : Number,
    humidity:Number,
    temperature:Number
},{timestamps:true})

module.exports = mongoose.model("data",DataSchema)
