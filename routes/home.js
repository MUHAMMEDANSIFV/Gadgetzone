var express = require('express');
var router = express.Router();
const productHelper = require('../helpers/product-helper')
const homecollection = require('../controllers/home.controller');
const catagertHelper = require('../helpers/catagery-helpers')
const {
  cart
} = require('../controllers/home.controller');
const cartHelpers = require('../helpers/cart-helpers');
const { Collection, version } = require('mongoose');
const varification = require('../varification/varification')


/* GET users listing. */
router.get('/',varification.userlogin,homecollection.home );

router.get('/product/:id',varification.userlogin,homecollection.product)

router.get('/cart',varification.userlogin, homecollection.cart)

router.post('/addtocart/:id?',varification.userlogin, homecollection.addtocart)

router.post('/deletecart',varification.userlogin, homecollection.deletecart)

router.get('/addtowishlist/:id',varification.userlogin, homecollection.addtowishlist)

router.get('/wishlist',varification.userlogin, homecollection.wishlist)

router.get('/deletewishlist/:id',varification.userlogin,  homecollection.deletewishlist)

router.get('/placeorder',varification.userlogin, homecollection.placeorder)

router.post('/change-product-quantity',varification.userlogin, homecollection.changeproductquantity)

router.post('/addnewaddress',varification.userlogin, homecollection.addnewaddress)

router.get('/deleteaddress/:id',varification.userlogin, homecollection.deleteaddress)

router.post('/chechout/:addressid?/:total?/:paymentmethod?/:couponid?',varification.userlogin, homecollection.checkout)

router.get('/orders',varification.userlogin, homecollection.vieworders)

router.get('/order/:id',varification.userlogin,homecollection.order)

router.get('/user-profile',varification.userlogin,homecollection.userprofile)

router.post('/editaddress',varification.userlogin,homecollection.editaddress)

router.post('/verify-payment',varification.userlogin,homecollection.verifypayment)

router.post('/user-profile-edit', varification.userlogin , homecollection.userprofileedit)

router.post('/selected-catagery',varification.userlogin,homecollection.findbycatagery)

router.post('/order-cencel',varification.userlogin,homecollection.ordercancel)

router.post('/password-checking',varification.userlogin,homecollection.passwordchecking)

router.post('/password-changing',varification.userlogin,homecollection.passwordchanging)

router.get('/order-seccess/:orderid?',varification.userlogin,homecollection.ordersuccess)

router.get('/coupons',varification.userlogin,homecollection.viewcoupons)

router.post('/check-coupon',varification.userlogin,homecollection.checkcoupon)

module.exports = router;