const mongoose = require('mongoose')
const { Schema } = mongoose;

module.exports = {
    PRODUCT_COLLECTION:'product',
    PRODUCT_SCHEMA:mongoose.Schema({
        Name:String,
        OldPrice:String,
        Catagery:
        {
            type : Schema.Types.ObjectId , ref: 'catagery'
        },
        Price:String,
        Discount:String,
        Size:String,
        Color:String,
        Stock:String,
        Specification:String,
        Description:String
    },{timestamps:true})
}