const mongoose = require('mongoose')
const bannermodal = require('../models/banner')

const bannersmodal = mongoose.model(bannermodal.BANNER_COLLECTION,bannermodal.BANNER_SCHEMA)

module.exports = {
    addbanner:(data) => {
        return new Promise((resolve,reject)=>{
           const banner = new bannersmodal(data)
           banner.save().then((done) => {
             resolve(done)
           }).catch((err) => {
            console.log(err);
            reject()
           })
        })
    },
    viewbanners:()=>{
      return new Promise((resolve,reject) => {
         bannersmodal.find().then((done)=>{
          resolve(done)
         }).catch((err)=>{
          console.log(err);
          reject()
         })

      })
    },
    deletebanner:(id)=>{
      return new Promise((resolve,reject)=>{
        bannersmodal.findById(id).remove().then((done)=>{
          resolve(done)
        }).catch((err)=>{
          reject(err)
        })
      })
    },
    find:(id)=>{
      return new Promise((resolve,reject) => {
        bannersmodal.findById(id).then((done) => {
          resolve(done)
        }).catch((err)=>{
          console.log(err);
          reject(err)
        })
      })
    },
    editbanner:(id,data)=>{
      return new Promise((resolve,reject)=>{
        bannersmodal.findByIdAndUpdate(id,{
          $set:data
        }).then((done)=>{
          resolve(done)
        }).catch((err)=>{
          console.log(err);
          reject()
        })
      })
    }
}

