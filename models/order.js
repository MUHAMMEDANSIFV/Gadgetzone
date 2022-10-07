const {
        ObjectId
} = require('mongodb')
const mongoose = require('mongoose')

module.exports = {
        ORDER_COLLECTION: 'order',
        ORDER_SCHEMA: mongoose.Schema({
                userid: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users'
                },
                addressid: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'address'
                },
                products: [{
                        items: Object,
                        quantity: Number,
                        Category:Object,
                        total:Number
                }],
                dates:{
                                orderconfirmed:Date,
                                shipped:Date,
                                outfordelivery:Date
                        },
                total: Number,
                orderstatus:String ,
                trackingstatus:String,
                paymentmethod:String,
                paymentstatus: String,
                paidamount:{
                        type:Number,
                        default: 0
                },
                cancelmessage:String,
                refund:String,
                refundamount:Number,
                usedcoupon:{
                        type:mongoose.Schema.Types.ObjectId , ref:'coupons'
                },
                discountprice:Number,
                orderDate:Date
        },{timestamps:true})
}