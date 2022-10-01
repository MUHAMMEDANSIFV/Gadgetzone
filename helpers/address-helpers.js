const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const addressmodal = require('../models/address')
const usermodal = require('../models/Users')

const addresses = mongoose.model(addressmodal.ADDRESS_COLLECTION,addressmodal.ADDRESS_SCHEMA)
const users = mongoose.model(usermodal.USER_COLLECTION,usermodal.USER_SCHEMA)

module.exports = {
    addnewaddress:(userid,data)=>{
      console.log(data);
        return new Promise((resolve,reject)=>{
      const address = new addresses(data)
      address.save().then((done)=>{
        users.findOne({_id:ObjectId(userid)}).then((user)=>{
          console.log(user);
            user.addresses.push(done._id)
            user.save()
        console.log(done+'done');
        resolve(done)
        })
      }).catch((error)=>{
        reject(error)
      })
        })
    },
    viewaddress:(userid)=>{
       return new Promise((resolve,reject)=>{
        users.findById(userid).populate('addresses').lean().then((done)=>{
          resolve(done)
        })
       })
    },
    deleteaddress:(userid,addressid)=>{
      return new Promise((resolve,reject)=>{
       const deleteaddress = new addresses({_id:addressid})
       deleteaddress.remove()
       users.updateOne({_id:ObjectId(userid)},{
        $pull:{
          addresses:addressid
        }
      }).then((data)=>{
         resolve(data)
       }).catch((err)=>{
        console.log('a error find in delete product. address-helpers line no:40\n'+err)
       })
      })
    },
    editaddress:(data,addressid)=>{
      return new Promise((resolve,reject)=>{
        console.log(data);
        addresses.findOneAndUpdate({_id:addressid},{
          $set:{
            firstname:data.firstname,
            lastname:data.lastname,
            mobile:data.mobile,
            email:data.email,
            address:data.address,
            city:data.city,
            pincode:data.pincode,
            locality:data.locality,
            landmark:data.landmark,
            alternatemobile:data.alternatemobile
          }
        }).then((done)=>{
          resolve(done)
        }).catch((error)=>{
          console.log(error);
        })
      })
    }
}