const {
  ObjectID
} = require('bson')
const mongoose = require('mongoose')
const {
  details
} = require('../controllers/auth.controller')
const cart = require('../models/cart')
const CART = require('../models/cart')
const Catagery = require('../models/Catagery')
const products = require('../models/product')
const usermodel = require('../models/Users')
const {
  findone
} = require('./catagery-helpers')

const carts = mongoose.model(CART.CART_COLLECION, CART.CART_SCHEMA)
const productmodal = mongoose.model(products.PRODUCT_COLLECTION, products.PRODUCT_SCHEMA)
const users = mongoose.model(usermodel.USER_COLLECTION, usermodel.USER_SCHEMA)

module.exports = {
  addtocart: async (user, productid) => {
    const productdetails = await productmodal.findById(productid)
    console.log(productdetails);
    var product = {
      items: ObjectID(productid),
      quantity: 1,
      total: productdetails.Price
    }
    return new Promise((resolve, reject) => {
      carts.findOne({
        userid: ObjectID(user)
      }).then((exist) => {
        if (exist) {
          console.log(exist);
          var increment = exist.products.find((item) => item.items == productid)
          if (increment) {
            carts.findOneAndUpdate({
              userid: user,
              'products.items': productid
            }, {
              $inc: {
                'products.$.quantity': 1,
                'products.$.total': productdetails.Price
              }
            }).then((data) => {
              resolve(data)
            })
          } else {
            exist.products.push(product)
            exist.save()
            resolve(exist)
          }
        } else {
          console.log(product)
          const cart = new carts({
            userid: ObjectID(user),
            products: product
          })
          cart.save().then((data) => {
            const done = data
            console.log(done)
            resolve(done)
          }).catch((err) => {
            reject(err)
          })
        }
      })

    })
  },
  findcart: (id) => {
    return new Promise(async (resolve, reject) => {
      // const user1 = await users.findById(id).populate('addresses')
      const cart = await carts.findOne({
        userid: id
      }).populate('products.items')
      if (cart == null) {
        var res = {
          cart: null,
          count: 0
        }
        resolve(res)
      } else {
        const cartCount = cart.products.length
        if (cartCount == 1) {
          var sum = cart.products[0].total
        } else {
          var sum = calculatecarttotal(cart.products)
        }
        const respons = {
          cart: cart.products,
          count: cartCount,
          sum: sum
          // user:user1
        }
        resolve(respons)
      }
    }).catch((err) => {
      reject(err)
    })
  },
  deletecart: (details) => {
    return new Promise(async (resolve, reject) => {
      carts.updateOne({
        userid: ObjectID(details.user)
      }, {
        $pull: {
          products: {
            items: ObjectID(details.product)
          }
        }
      }).then((done) => {
        resolve(done = 'ok')
      }).catch((err) => {
        reject(err)
      })
    })
  },
  changeproductquantity: (details) => {
    return new Promise((resolve, reject) => {
      var count = parseInt(details.count)
      var quantity = parseInt(details.quantity)
      var price = parseInt(details.price)
      if (count == -1 && quantity == 1) {
        carts.updateOne({
          userid: details.cart
        }, {
          $pull: {
            products: {
              items: details.product
            }
          }
        }).then((done) => {
          resolve({
            data: 0
          })
        })
      } else {
        carts.findOneAndUpdate({
          userid: details.cart,
          'products.items': details.product
        }, {
          $inc: {
            'products.$.quantity': count,
            'products.$.total': price
          }
        }).then((data) => {
          const product = data.products.find((item) => item.items == details.product)
          if (data.products.length == 1) {
            var sum = product.total
          } else {
            var sum = calculatecarttotal(data.products)
          }
          const done = {
            product: product,
            sum: sum
          }
          resolve(done)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

function calculatecarttotal(products) {
  if (products.length == 0) {
    return 0;
  }
  let sum = products.reduce((total, num) => total.total + num.total)
  return sum
}