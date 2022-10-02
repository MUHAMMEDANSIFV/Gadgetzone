const mongoose = require('mongoose')
const collection = require('../models/product')
const db = require('../config/conection')
const { ObjectID } = require('bson')
const { routes } = require('../app')
const catagery = require('../helpers/catagery-helpers')
const catagerys = require('../models/Catagery')

var product = mongoose.model(collection.PRODUCT_COLLECTION,collection.PRODUCT_SCHEMA)
var cata = mongoose.model(catagerys.CATAGERY_COLLECTION,catagerys.CATAGERY_SCHEMA)

module.exports={

    addproduct:(data)=>{
       return new Promise((resolve,reject)=>{
        catagery.findone(data).then((id)=>{
            console.log(id);
            data.Catagery = id
            var products = new product(data)
            products.save().then((result)=>{
                resolve(result._id)
            })
        })
       })
    },
    viewproduct:()=>{
        return new Promise(async(resolve,reject)=>{
            var allproduct = await product.find({}).populate('Catagery').lean()
            resolve(allproduct)
        })
    },
    findproduct:(id)=>{
        return new Promise(async(resolve,reject)=>{
            var editproduct = await product.findById(id).populate('Catagery')
            resolve(editproduct)
        })
    },
    editproduct:(id,data)=>{
        return new Promise((resolve,reject)=>{
            product.updateOne({_id:ObjectID(id)},{
                Name:data.Name,
                Model:data.Model,
                Catagery:data.Catagery,
                Price:data.Price,
                Discount:data.Discount,
                Size:data.Size,
                Color:data.Color,
                Stock:data.Stock,
                Specification:data.Specification,
                Description:data.Description
            }).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
               })
        })
    },
    deleteproduct:(id)=>{
        return new Promise(async(resolve,reject)=>{
            var deleteproduct = await product.findById(id)
            deleteproduct.remove({})
            resolve(id)
            })
    },
    findbycatagery:(id)=>{
        console.log('hallooo');
        return new Promise((resolve,reject)=>{
            product.find().populate('Catagery').then((data)=>{
                const products = data.filter((item)=>{
                   const catagery = item.Catagery._id == id
                   return catagery
                })
                resolve(products)
            }).catch((err)=>{
                reject(err)
               })
        })
    }
       
}