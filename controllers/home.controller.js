const catageryHelper = require('../helpers/catagery-helpers')
const userHelper = require('../helpers/user-helper')
const cartHelper = require('../helpers/cart-helpers')
const productHelper = require('../helpers/product-helper')
const wishlistHelper = require('../helpers/wishlist-helpers')
const addressHelper = require('../helpers/address-helpers')
const orderHelper = require('../helpers/order-helpers')
const couponsHelper = require('../helpers/couponhelpers')
const {
    render
} = require('../app')
const {
    details
} = require('./auth.controller')


module.exports = {
    home: async(req, res, next) => {
        try{
           const product =await productHelper.viewproduct()
              const done =await cartHelper.findcart(req.session.userlogin)
                    const catagery = await catageryHelper.viewcatagery()
                    console.log(product)
                    const data = done.cart
                    const cartCount = done.count
                    console.log(catagery);
                    res.render('home/home', {
                        product,
                        data,
                        cartCount,
                        catagery
                    })
        }catch(err) {
            console.log(err);
            next()
        }
    },
    product: async(req, res, next) => {
        try{
            const product =await productHelper.findproduct(req.params.id)
            res.render('home/product', {
                product
            })
        }catch(err) {
            console.log(err);
            next()
        }
    },
    cart: async(req, res,next) => {
        try{
            const done =await cartHelper.findcart(req.session.userlogin)
            const data = done.cart
            const cartCount = done.count
            const user = req.session.userlogin
            const sum = done.sum
            console.log(sum);
            res.render('home/cart', {
                data,
                cartCount,
                user,
                sum
            })
        }catch(err) {
            console.log(err);
            next()
        }
    },
    addtocart: async(req, res,next) => {
        try{
            const done =await cartHelper.addtocart(req.session.userlogin, req.params.id)
            if (done) {
                res.status(200).send(done);
            } else {
                console.log('add to cart is failed please try again');
            }
        }catch(err) {
            console.log(err);
            next()
        }
    },
    deletecart: async(req, res,next) => {
        try{
            const data =await cartHelper.deletecart(req.body)
            res.json(data)
        }catch(err) {
            console.log(err);
            next()
        }
    },
    addtowishlist: async(req, res,next) => {
        try{
            const done =await wishlistHelper.addtowishlist(req.session.userlogin, req.params.id)
            if (done) {
                res.redirect('back')
            }
        }catch(err) {
          console.log(err);
          next()
        }
    },
    wishlist: async(req, res,next) => {
        try{
            const data =await wishlistHelper.viewwishlist(req.session.userlogin)
            res.render('home/wishlist', {
                data
            })
        }catch(err) {
            console.log(err);
            next()
        }
    },
    deletewishlist: async(req, res,next) => {
        try{
            await wishlistHelper.deletewishlist(req.params.id)
            res.redirect('back')
        }catch(err) {
            console.log(err);
            next()
        }
    },
    placeorder: async(req, res,next) => {
        try{
            const done =await cartHelper.findcart(req.session.userlogin)
            const user =await addressHelper.viewaddress(req.session.userlogin)
                 const data = done.cart
                 const sum = done.sum
                 if (data == null) {
                     res.redirect('/home/cart')
                 } else {
                     res.render('home/checkout', {
                         data,
                         user,
                         sum
                     })
                 }
        }catch(err) {
            console.log(err);
            next()
        }
    },
    changeproductquantity: (req, res) => {
        req.body.cart = req.session.userlogin
        cartHelper.changeproductquantity(req.body).then((data) => {
            res.json(data)
        })
    },
    addnewaddress: (req, res) => {
        addressHelper.addnewaddress(req.session.userlogin, req.body).then((done) => {
            res.json(done)
        }).catch((error) => {
            console.log(error);
        })
    },
    deleteaddress: (req, res) => {
        console.log(req.params.id);
        console.log(req.session.userlogin)
        addressHelper.deleteaddress(req.session.userlogin, req.params.id).then((data) => {
            res.json(data)
        })
    },
    checkout: async(req, res,next) => {
        try{
            const done =await orderHelper.palceorder(req.params.addressid, req.session.userlogin, req.params.total, req.params.paymentmethod,req.params.couponid)
            if (req.params.paymentmethod == "COD") {
                res.json(done)
            } else {
                 const data = await userHelper.creatrazorpay(done._id, req.params.total)
                    res.json(data)
            }
        }catch(err) {
            console.log(err);
            next()
        }
    },
    vieworders: async(req, res,next) => {
        try{
            const data =await orderHelper.vieworders(req.session.userlogin)
            res.render('home/orders', {
                data
            })
        }catch(err) {
            console.log(err);
            next()
        }
    },
    order: async(req, res,next) => {
        try{
            const order =await orderHelper.findeachorder(req.params.id)
            res.render('home/order', {
                order
            })
        }catch(err) {
            console.log(err);
            next()
        }
    },
    userprofile: async(req, res,next) => {
       try{
        const user = await userHelper.finduser(req.session.userlogin)
        console.log(user);
        res.render('home/userprofile', {
            user
        })
       }catch(err) {
        console.log(err);
        next()
       }
    },
    editaddress: async(req, res,next) => {
        try{
            const data =await addressHelper.editaddress(req.body, req.body.addressid)
            res.json(data)
        }catch(err) {
            console.log(err);
            next()
        }
    },
    verifypayment: async(req, res,next) => {
        try{
            const data =await userHelper.verifypayment(req.session.userlogin, req.body, req.body)
            res.json(data)
        }catch(err) {
            console.log(err);
            next()
        }
    },
    userprofileedit: async(req, res,err) => {
          try{
            await userHelper.userprofileedit(req.body.keyword, req.body.value, req.session.userlogin)
            res.json({
                status: true
            })
          }catch(err) {
            console.log(err);
            next()
          }
    },
    findbycatagery: async(req, res,next) => {
        try{
            const product = await productHelper.findbycatagery(req.body.id)
            res.json(product)
        }catch(err) {
            console.log(err);
            next()
        }
    },
    ordercancel: async(req, res,next) => {
       try{
        const data =await orderHelper.changestatus(req.body.orderid, req.body.status)
        res.json(data)
       }catch(err) {
        console.log(err);
        next()
       }
    },
    passwordchecking: async(req, res,next) => {
         try{
            const done =await userHelper.passwordchecking(req.session.userlogin, req.body.password)
            res.json(done)
         }catch(err) {
            console.log(err);
            next()
         }
    },
    passwordchanging: async(req, res,next) => {
       try{
        const passwordstatus =await userHelper.passwordchecking(req.session.userlogin, req.body.oldpassword)
        if (passwordstatus) {
            const data =await userHelper.passwordchanging(req.session.userlogin, req.body)
                res.json(data)
        } else res.json({
            status: false
        })
       }catch(err) {
        console.log(err);
        next()
       }
    },
    ordersuccess: async(req,res,next) => {
       try{
        const order =await orderHelper.findorder(req.params.orderid)
            res.render('home/ordersuccess',{order})
       }catch(err) {
        console.log(err);
        next()
       }
    },
    viewcoupons: async(req,res,next) => {
        try{
            const coupons =await couponsHelper.viewcoupons()
            const username = req.session.username
            res.render('home/coupons',{coupons,username})
        }catch(err) {
            console.log(err);
            next()
        }
    },
    checkcoupon: async(req,res,next) => {
       try{
        const coupon = await couponsHelper.checkcoupon(req.session.userlogin,req.body.code)
             res.json(coupon)
       }catch(err) {
        console.log(err);
        next()
       }
    }
}