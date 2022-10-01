const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

module.exports={
    CATAGERY_COLLECTION:'catagery',
    CATAGERY_SCHEMA:mongoose.Schema({
        catagery:String,
    },{timestamps:true})
}