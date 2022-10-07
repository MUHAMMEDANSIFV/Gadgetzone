const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

module.exports={
    CART_COLLECION : 'cart',
    CART_SCHEMA : mongoose.Schema({
        userid:ObjectId,
        products:[
            {items:
                {type:mongoose.Schema.Types.ObjectId , ref:'product'},
            quantity:Number,
            Category:Object,
            total:Number
        }
    ]
    })
}