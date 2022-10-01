const express = require('express');
const router = express.Router();
const varification = require('../varification/varification')
const Dashbordcontroller = require('../controllers/Dashbord.controller')
const {
  viewproduct
} = require('../helpers/product-helper');
const Handlebars = require('handlebars');
const {
  route
} = require('.');
Handlebars.registerHelper("increment", function (value) {
  return parseInt(value) + 1;
});+


/* GET users listing. */
router.get('/',varification.adminlogin,Dashbordcontroller.Dashbord);

//  ADDE PRODUCT
router.get('/addproduct',varification.adminlogin,Dashbordcontroller.addlproduct);

router.post('/productdetails',varification.adminlogin,Dashbordcontroller.productdetailes)

// view product
router.get('/viewproduct',varification.adminlogin,Dashbordcontroller.viewproduct);

//  Edit Product
router.get('/editproduct/:id',varification.adminlogin, Dashbordcontroller.editproduct);


router.post('/productdetails/:id',varification.adminlogin,Dashbordcontroller.productdetailes)

//  Delete product
router.get('/deleteproduct/:id',varification.adminlogin,Dashbordcontroller.deleteproduct)

//  users
router.get('/users',varification.adminlogin,Dashbordcontroller.users);

router.get('/block/:id',varification.adminlogin,Dashbordcontroller.block)

router.get('/active/:id',varification.adminlogin,Dashbordcontroller.active)

router.get('/delete/:id',varification.adminlogin,Dashbordcontroller.delete)

router.get('/addcatagery',varification.adminlogin,Dashbordcontroller.addcategary)

router.get('/viewcatagery',varification.adminlogin,Dashbordcontroller.viewcatagery)

router.post('/addcatagery',varification.adminlogin,Dashbordcontroller.postaddcatagery)

router.get('/editcatagery/:id',varification.adminlogin,Dashbordcontroller.editcatagery)

router.post('/editcatagery/:id',varification.adminlogin,Dashbordcontroller.posteditcatagery)

router.get('/deletecatagery/:id',varification.adminlogin,Dashbordcontroller.deletecatagery)

router.get('/orderlist/:id?', varification.adminlogin , Dashbordcontroller.orderlist)

router.post('/orderdetails',varification.adminlogin, Dashbordcontroller.orderdetails)

router.post('/changestatus',varification.adminlogin , Dashbordcontroller.changestatus)

router.get('/orders',varification.adminlogin,Dashbordcontroller.orders)

router.get('/order/:orderid?',varification.adminlogin,Dashbordcontroller.order)

router.get('/coupons',varification.adminlogin,Dashbordcontroller.coupons)

router.get('/coupons/add-coupon',varification.adminlogin,Dashbordcontroller.addcoupon)

router.post("/coupon/add-coupon",varification.adminlogin,Dashbordcontroller.addcouponpost)

router.post('/delete-coupon',varification.adminlogin,Dashbordcontroller.deletecoupon)


module.exports = router;