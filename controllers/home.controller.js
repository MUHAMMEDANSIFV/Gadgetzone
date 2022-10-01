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
    home: (req, res, next) => {
        productHelper.viewproduct().then((product) => {
            cartHelper.findcart(req.session.userlogin).then(async (done) => {
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
            })
        })
    },
    product: (req, res) => {
        productHelper.findproduct(req.params.id).then((product) => {
            res.render('home/product', {
                product
            })
        })
    },
    cart: (req, res) => {
        cartHelper.findcart(req.session.userlogin).then((done) => {
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
        })
    },
    addtocart: (req, res) => {
        console.log('add to cart');
        cartHelper.addtocart(req.session.userlogin, req.params.id).then((done) => {
            if (done) {
                res.status(200).send(done);
            } else {
                console.log('add to cart is failed please try again');
            }
        })
    },
    deletecart: (req, res) => {
        cartHelper.deletecart(req.body).then((data) => {
            res.json(data)
        })
    },
    addtowishlist: (req, res) => {
        wishlistHelper.addtowishlist(req.session.userlogin, req.params.id).then((done) => {
            if (done) {
                res.redirect('back')
            }
        })
    },
    wishlist: (req, res) => {
        wishlistHelper.viewwishlist(req.session.userlogin).then((data) => {
            res.render('home/wishlist', {
                data
            })
        })
    },
    deletewishlist: (req, res) => {
        wishlistHelper.deletewishlist(req.params.id).then((done) => {
            res.redirect('back')
        })
    },
    placeorder: (req, res) => {
        cartHelper.findcart(req.session.userlogin).then((done) => {
            addressHelper.viewaddress(req.session.userlogin).then((user) => {
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
            })
        })
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
    checkout: (req, res) => {
        orderHelper.palceorder(req.params.addressid, req.session.userlogin, req.params.total, req.params.paymentmethod,req.params.couponid).then((done) => {
            if (req.params.paymentmethod == "COD") {
                res.json(done)
            } else {
                userHelper.creatrazorpay(done._id, req.params.total).then((done) => {
                    res.json(done)
                })
            }
        })
    },
    vieworders: (req, res) => {
        console.log(req.session.userlogin);
        orderHelper.vieworders(req.session.userlogin).then((data) => {
            console.log(data);
            res.render('home/orders', {
                data
            })
        })
    },
    order: (req, res) => {
        orderHelper.findeachorder(req.params.id).then((order) => {
            res.render('home/order', {
                order
            })
        })
    },
    userprofile: (req, res) => {
        userHelper.finduser(req.session.userlogin).then((user) => {
            console.log(user);
            res.render('home/userprofile', {
                user
            })
        }).catch((error) => {
            res.send(user + '\n error find userprofile page loding time ')
        })
    },
    editaddress: (req, res) => {
        console.log(req.body);
        addressHelper.editaddress(req.body, req.body.addressid).then((data) => {
            res.json(data)
        }).catch((error) => {
            console.log(error);
        })
    },
    verifypayment: (req, res) => {
        userHelper.verifypayment(req.session.userlogin, req.body, req.body).then((data) => {
            res.json(data)
        })
    },
    userprofileedit: (req, res) => {
        userHelper.userprofileedit(req.body.keyword, req.body.value, req.session.userlogin).then((data) => {
            res.json({
                status: true
            })
        }).catch((error) => {
            console.log(error + '\n error find in home controllers')
        })
    },
    findbycatagery: (req, res) => {
        console.log(req.body.id);
        productHelper.findbycatagery(req.body.id).then((product) => {
            res.json(product)
        })
    },
    ordercancel: (req, res) => {
        orderHelper.changestatus(req.body.orderid, req.body.status).then((data) => {
            res.json(data)
        }).catch((error) => {
            console.log(error);
        })
    },
    passwordchecking: (req, res) => {
        console.log(req.body)
        userHelper.passwordchecking(req.session.userlogin, req.body.password).then((done) => {
            res.json(done)
        })
    },
    passwordchanging: (req, res) => {
        userHelper.passwordchecking(req.session.userlogin, req.body.oldpassword).then((passwordstatus) => {
            if (passwordstatus) {
                userHelper.passwordchanging(req.session.userlogin, req.body).then((data) => {
                    res.json(data)
                }).catch((error) => {
                    console.log(error);
                })
            } else res.json({
                status: false
            })
        })
    },
    ordersuccess:(req,res) => {
        orderHelper.findorder(req.params.orderid).then((order) => {
            res.render('home/ordersuccess',{order})
        })
    },
    viewcoupons:(req,res) => {
      couponsHelper.viewcoupons().then((coupons) => {
        const username = req.session.username
        res.render('home/coupons',{coupons,username})
      })
    },
    checkcoupon:(req,res) => {
        console.log(req.body);
        couponsHelper.checkcoupon(req.session.userlogin,req.body.code).then((coupon) => {
             res.json(coupon)
        }).catch((err) => {
            console.log(err);
        })
    }
}