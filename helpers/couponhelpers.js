const mongoose = require('mongoose')
const {
    resource
} = require('../app')
const couponmodal = require('../models/coupons')

const coupons = mongoose.model(couponmodal.COUPONS_COLLECTION, couponmodal.COUPONS_SCHEMA)

module.exports = {
    addcoupon: (data) => {
        return new Promise((resolve, reject) => {
            const coupon = new coupons(data)
            coupon.save().then((done) => {
                resolve(done)
            }).catch((err)=>{
                reject(err)
               })
        })
    },
    viewcoupons: () => {
        return new Promise((resolve, reject) => {
            coupons.find({}).then((coupons) => {
                console.log(coupons);
                resolve(coupons)
            }).catch((err)=>{
                reject(err)
               })
        })
    },
    deletecoupon: (couponid) => {
        return new Promise((resolve, reject) => {
            coupons.findById(couponid).remove().then((done) => {
                resolve(done)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    checkcoupon: (userid, code) => {
        return new Promise((resolve, reject) => {
            coupons.findOne({
                code: code
            }).then((coupon) => {
                if (coupon != null) {
                    const userexist = coupon.users.find(item => item == userid)
                    if (userexist) resolve('exist')
                }
                if (coupon == null) resolve(null)
                else resolve(coupon)
            }).catch((err)=>{
                reject(err)
               })
        })
    }
}