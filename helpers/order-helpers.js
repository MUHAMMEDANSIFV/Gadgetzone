const mongoose = require('mongoose')
const usersmodales = require('../models/Users')
const ordersmodales = require('../models/order')
const couponmodales = require('../models/coupons')
const {
    ObjectID
} = require('bson')
const CART = require('../models/cart')
const {
    NetworkContext
} = require('twilio/lib/rest/supersim/v1/network')
const {
    response
} = require('../app')
const Catagery = require('../models/Catagery')

const users = mongoose.model(usersmodales.USER_COLLECTION, usersmodales.USER_SCHEMA)
const carts = mongoose.model(CART.CART_COLLECION, CART.CART_SCHEMA)
const orders = mongoose.model(ordersmodales.ORDER_COLLECTION, ordersmodales.ORDER_SCHEMA)
const coupons = mongoose.model(couponmodales.COUPONS_COLLECTION, couponmodales.COUPONS_SCHEMA)

module.exports = {
    palceorder: (addressid, userid, total, paymentmethod, couponid) => {
        return new Promise((resolve, reject) => {
            const orderstaus = paymentmethod == 'COD' ? "Confirmed" : "Pending"
            const trackingstatus = paymentmethod == 'COD' ? "Order Confirmed" : "Waiting For Payment"
            carts.findOne({
                userid: userid
            }).populate('products.items').populate('products.items.Catagery').then((cart) => {
               console.log(cart.products.Catagery);
                const product = {
                    userid: userid,
                    addressid: addressid,
                    products: cart.products,
                    total: total,
                    orderstatus: orderstaus,
                    trackingstatus: trackingstatus,
                    paymentmethod: paymentmethod,
                    paymentstatus: 'Not Paid'
                }
                const order = new orders(product)
                order.save().then(async (done) => {
                    await coupons.findByIdAndUpdate(ObjectID(couponid), {
                        $push: {
                            users: userid
                        }
                    })
                    if (done) {
                        await carts.findOne({
                            userid: userid
                        }).remove({})
                        console.log('cart remove seccess');
                    }
                    console.log(done);
                    resolve(done)
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        })
    },
    findorder: (id) => {
        return new Promise((resolve, reject) => {
            console.log(id);
            orders.findById(id).populate('addressid').populate('products.items').then((order) => {
                console.log(order + 'order');
                resolve(order)
            }).catch((err) => {
                reject(err)
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
                reject(error)
            })
        })
    },
    findeachorder: (id) => {
        return new Promise((resolve, reject) => {
            orders.findById(id).populate('userid').populate('addressid').populate('products.items').populate('products.items.Catagery').then((order) => {
                console.log(order);
                resolve(order)
            }).catch((error) => {
                console.log(error + '\n This error find in order helpers find each product ');
                reject(error)
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
                reject(error)
            })
        })
    },
    changestatus: (orderid, changestatus) => {
        return new Promise((resolve, reject) => {
            let status = changestatus == 'Delivered' ? 'Paid' : 'Not Paid'
            orders.findByIdAndUpdate(orderid, {
                $set: {
                    trackingstatus: changestatus,
                    paymentstatus: status
                }
            }).then((done) => {
                resolve(done)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    orders: () => {
        return new Promise((resolve, reject) => {
            console.log('alsdkfjlasdkf');
            orders.find({}).sort({
                createdAt: "descending"
            }).then((data) => {
                console.log(data);
                resolve(data)
            }).catch((error) => {
                console.log(error);
                reject(error)
            })
        })
    },
    order: (orderid) => {
        try {
            return new Promise(async (resolve, reject) => {
                const order = await orders.findById(orderid).populate('userid').populate('addressid').populate('products.items').populate('products.items.Catagery')
                if (order == null) reject()
                resolve(order)
            })
        } catch (err) {
            reject(err)
        }
    },
    salescalculation: () => {
        return new Promise(async (resolve, reject) => {
            const order =await orders.aggregate([{
                $match:{
                    paymentstatus:'Paid'
                }
        },{
            $unwind:{
                path:'$products'
            }
        },{
            $group:{
                _id:{
                    day:{$dayOfMonth:'$createdAt'},
                    month:{$month:'$createdAt'},
                    year:{$year:'$createdAt'}
                },
                totalsum:{$sum:'$total'},
                totalquantity:{$sum:'$products.quantity'},
                totalcount:{$sum:1}
            }
        },{
            $sort:{'_id.day':-1,'_id.month':-1,'_id.year':-1}
        }
    ]).catch((err)=>{
        console.log(err);
        reject()
    })
            console.log(order);
            resolve(order)
        })
    },
    todaysales:()=>{
        return new Promise((resolve,reject)=>{
            var start = new Date();
            start.setUTCHours(0, 0, 0, 0);

            var end = new Date();
            end.setUTCHours(23, 59, 59, 999); 
            orders.aggregate([{$match:{
                paymentstatus:'Paid'
            }},{
                $match:{createdAt:{
                        $gte:start,
                        $lte:end
                    }
                }
            },{
                $group:{
                    _id:{paymentstatus:'Paid'},
                    todayrevenue:{$sum:'$total'},
                    todaysale:{$sum:1}
                }
            }]).then((todaysales)=>{
                console.log(todaysales);
              resolve(todaysales)
            }).catch((err)=>{
                console.log(err);
                reject(err)
            })
        })
    },
    totalsales:()=>{
        return new Promise((resolve,reject)=>{
             orders.aggregate([{
                $match:{
                    paymentstatus:'Paid'
                }
             },{$group:{
                _id:{paymentstatus:'Paid'},
                totalsale:{$sum:1},
                totalrevenue:{$sum:'$total'}
            }}]).then((totalsales)=>{
                console.log(totalsales);
                resolve(totalsales)
            }).catch((err)=>{
                console.log(err);
                reject()
            })
        })
    },
    salescountcatagery:()=>{
        return new Promise((resolve,reject) => {
            orders.aggregate([{
                $match:{
                    paymentstatus:'Paid'
                }
            },{
                $unwind:{
                    path:'$products'
                }
            }
            ,{
                $group:{
                    _id:'$products.Category',
                    count:{$sum:1}
                }
            },{
                $sort:{count:1}
            }]).then((salescountcatagery)=>{
            resolve(salescountcatagery)
            console.log(salescountcatagery);
        })
        })
    },
    salsetable:()=>{
        return new Promise((resolve,reject) => {
resolve()
        })
    }
};