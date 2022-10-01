const mongoose = require('mongoose')


module.exports = {
     COUPONS_COLLECTION : 'coupons',
     COUPONS_SCHEMA : mongoose.Schema({
        code:String,
        description:String,
        discountamount:Number,
        status:Boolean,
        minvalue:Number,
        valid_from:Date,
        valid_until:Date,
        users:[
          {type:mongoose.Schema.Types.ObjectId , ref:'users'}
        ]
     },{timestamps:true})
}