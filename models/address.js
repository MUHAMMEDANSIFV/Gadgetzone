const mongoose = require('mongoose')

module.exports = {
    ADDRESS_COLLECTION : 'address',
    ADDRESS_SCHEMA : mongoose.Schema({
        firstname:String,
        lastname:String,
        mobile:Number,
        email:String,
        address:String,
        city:String,
        pincode:String,
        locality:String,
        landmark:String,
        alternatemobile:Number
    })
}