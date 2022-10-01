const mongoose = require('mongoose')
const usersmodales = require('../models/Users')
const ordersmodales = require('../models/order')
const couponmodales =require('../models/coupons')
const {
    ObjectID
} = require('bson')
const CART = require('../models/cart')

const users = mongoose.model(usersmodales.USER_COLLECTION, usersmodales.USER_SCHEMA)
const carts = mongoose.model(CART.CART_COLLECION, CART.CART_SCHEMA)
const orders = mongoose.model(ordersmodales.ORDER_COLLECTION, ordersmodales.ORDER_SCHEMA)
const coupons = mongoose.model(couponmodales.COUPONS_COLLECTION,couponmodales.COUPONS_SCHEMA)

module.exports = {
    palceorder: (addressid, userid, total, paymentmethod,couponid) => {
        return new Promise((resolve, reject) => {
            const orderstaus = paymentmethod == 'COD' ? "Confirmed" : "Pending"
            const trackingstatus = paymentmethod == 'COD' ? "Order Confirmed" : "Waiting For Payment"
            carts.findOne({userid:userid}).then((cart) => {
                const product = {
                    userid: userid,
                    addressid: addressid,
                    products: cart.products,
                    total: total,
                    orderstatus: orderstaus ,
                    trackingstatus:trackingstatus,
                    paymentmethod:paymentmethod,
                    paymentstatus: 'Not Paid',
                }
                const order = new orders(product)
                order.save().then(async(done)=>{
                     const a = await coupons.findByIdAndUpdate(ObjectID(couponid),{
                    $push:{
                        users:userid
                    }
                   })
                    if(done){
                     await carts.findOne({userid:userid}).remove({})
                     console.log('cart remove seccess');
                    }
                    console.log(done);
                    resolve(done)
                })
            })
        })
    },
    findorder: (id) => {
        return new Promise((resolve, reject) => {
            console.log(id);
            orders.findById(id).populate('addressid').populate('products.items').then((order) => {
                console.log(order + 'order');
                resolve(order)
            })
        })
    },
    vieworders: (userid) => {
        return new Promise((resolve, reject) => {
            orders.find({
                userid: userid
            }).populate('userid').populate('addressid').populate('products.items').then((order) => {
                resolve(order)
            }).catch((error) => {
                console.log(error + '\n a error find in view orders order helpers');
            })
        })
    },
    findeachorder: ( id) => {
        return new Promise((resolve, reject) => {
            orders.findById(id).populate('userid').populate('addressid').populate('products.items').populate('products.items.Catagery').then((order) => {
                console.log(order);
                resolve(order)
            }).catch((error) => {
                console.log(error + '\n This error find in order helpers find each product ');
            })
        })
    },
    viewordersadmin: (id) => {
        return new Promise((resolve, reject) => {
            orders.findOne({
                userid: id
            }).populate('userid').populate('addressid').populate('products.items').then((data) => {
                resolve(data)
            }).catch((error) => {
                console.log(error + "\n error find in order hlelpers vieworderamin");
            })
        })
    },
    changestatus: ( orderid, changestatus) => {
        return new Promise((resolve, reject) => {
            orders.findByIdAndUpdate(orderid,{
                $set:{
                    trackingstatus:changestatus
                }
            }).then((done)=>{
                resolve(done)
            }).catch((err)=>{
                reject(err)
            })
    })
    },
    orders:() =>{
      return new Promise((resolve,reject)=>{
        console.log('alsdkfjlasdkf');
        orders.find({}).then((data)=>{
            console.log(data);
           resolve(data)
        }).catch((error)=>{
            console.log(error);
            reject(error)
        })
      })
    },
    order:(orderid)=>{
        return new Promise((resolve,reject)=>{
            orders.findById(orderid).populate('userid').populate('addressid').populate('products.items').populate('products.items.Catagery').then((order)=>{
                console.log(order);
                resolve(order)
            })
        })
    }
}