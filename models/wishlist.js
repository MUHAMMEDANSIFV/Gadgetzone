const mongoose = require('mongoose')

module.exports = {
    WISHLIST_COLLECTION:'wishlist',
    WISHLIST_SCHEMA: mongoose.Schema({
        userid:{
            type:mongoose.Schema.Types.ObjectId , ref : 'users'
        },
        productid:{
            type:mongoose.Schema.Types.ObjectId , ref : 'product'
        }
    })
}