const mongoose = require('mongoose')
const wishlistmodel = require('../models/wishlist')

const wishlist = mongoose.model(wishlistmodel.WISHLIST_COLLECTION,wishlistmodel.WISHLIST_SCHEMA)

module.exports = {
    addtowishlist:(userid,productid)=>{
        return new Promise((resolve,reject)=>{
        const wishlists = new wishlist({userid:userid,productid:productid})
        wishlists.save().then((done)=>{
            resolve(done)
        }).catch((err)=>{
            reject(err)
           })
        })
    },
    viewwishlist:(id)=>{
        return new Promise(async(resolve,reject)=>{
         const wishlists = await wishlist.find({userid:[id]}).populate('productid').lean()
            resolve(wishlists)
        })
    },
    deletewishlist:(id)=>{
        return new Promise(async(resolve,reject)=>{
            const deletewishlist = await wishlist({_id:id})
            deletewishlist.remove({})
            resolve(true)
        })
    },
    wishlistcount:(id)=>{
        return new Promise(async(resolve,reject)=>{
             wishlist.findOne({userid:id}).count().then((count)=>{
                resolve(count)
             }).catch((err)=>{
                console.log(err);
                reject(err)
             })

        })
    }
}