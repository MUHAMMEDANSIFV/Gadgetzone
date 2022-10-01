const { ObjectID } = require('bson')
const mongoose = require('mongoose')
const { routes } = require('../app')
const Catagery = require('../models/Catagery')

const catagerys = mongoose.model(Catagery.CATAGERY_COLLECTION,Catagery.CATAGERY_SCHEMA)

module.exports={
 
    addcatagery:(data)=>{
       return new Promise((resolve,reject)=>{
       catagerys.findOne({catagery:data.catagery}).then((exist)=>{
        if(exist) resolve(false)
       else{
        console.log(Date)
    const catagery = new catagerys({catagery:data.catagery})
       catagery.save().then((done)=>{
        resolve(done)
       })
       }
       })
       })
    },
    findone:(data)=>{
      return new Promise((resolve,reject)=>{
        catagerys.findOne({catagery:data.catagery}).then((done)=>{
            resolve(done)
        })
      })
    },
    viewcatagery:()=>{
        return new Promise((resolve,reject)=>{
            catagerys.find().then((data)=>{
                resolve(data)
            })
        })
    },
    findcatagery:(id)=>{
    return new Promise((resolve,reject)=>{
        catagerys.findById(id).then((data)=>{
        resolve(data)
        })
    })
    },
    editcatagery:(id,data)=>{
        return new Promise((resolve,reject)=>{
            console.log("id"+id+':data'+data);
            const currentdate = Date
            catagerys.updateOne({_id:id},{
                catagery:data.catagery
                        }).then((result)=>{
                resolve(result)
            })
        })
    },
    deletecatagery:(id)=>{
        return new Promise((resolve,reject)=>{
        catagerys.findById(id).then((data)=>{
        const catagery = new catagerys(data)
        catagery.remove({}).then((data)=>{
            resolve(data)
        })
        })
        })
    }
}