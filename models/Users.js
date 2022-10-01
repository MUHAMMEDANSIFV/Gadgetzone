const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')


module.exports={
    USER_COLLECTION:'users',
    USER_SCHEMA:mongoose.Schema({
        mobile:{
            type:Number,
            required: true,
            unique : true
        },
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            email:true
        },
        password:{
            type:String,
            required:true
        },
        button:{
            type:Boolean,
            required:true
        },
        status:{
            type:Boolean,
            required:true
        },
        addresses:[
            { type : mongoose.Schema.Types.ObjectId , ref:'address'}
        ]
    })
}