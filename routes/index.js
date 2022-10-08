var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/user-helper')
const productHelper = require('../helpers/product-helper');
const authentication = require('../controllers/auth.controller')
const catageryHelper = require('../helpers/catagery-helpers')
const bannerHelper = require('../helpers/banner-helpers')

var mismatch;
var loign
/* GET home page. */
router.get('/',  function(req, res, next) {
  if(req.session.userlogin){
    res.redirect('/home')
  }else if(req.session.adminlogin){
    res.redirect('/Dashbord')
  }else{
  productHelper.viewproduct().then(async(product)=>{
    const category = await catageryHelper.viewcatagery()
    const banners =await bannerHelper.viewbanners()
    console.log(category);
    req.session.destroy()
    res.render('index',{product,category,banners});
  })

  }
});

router.get('/login',authentication.login);

router.post('/login',authentication.postlogin)

router.get('/userlogout',(req,res)=>{
    req.session.userlogin = false
    res.redirect('/login')
})

router.get('/adminlogout',(req,res)=>{
  req.session.adminlogin = false
  res.redirect('/login')
})

module.exports = router;
