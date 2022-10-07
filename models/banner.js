const mongoose = require('mongoose')

module.exports = {
    BANNER_COLLECTION:'banner',
    BANNER_SCHEMA:mongoose.Schema({
        name:String,
        heading:String,
        subheading:String,
        description:String
    },{timestamps:true})
}
