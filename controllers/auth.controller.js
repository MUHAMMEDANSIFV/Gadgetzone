const userHelper = require('../helpers/user-helper')
const dotenv = require('dotenv')
dotenv.config()
const verificationotp = require('../varification/user.verifycation')
const varification = require('../varification/varification')

module.exports = {

  signup: (req, res,next) => {
   try{
    if (req.session.userlogin) {
      res.redirect('/home')
    } else if (req.session.adminlogin) {
      res.redirect('/Dashbord')
    } else {
      const alreadyexist = req.session.alreadyexist
      res.render('signup/signup', {
        alreadyexist
      })
    }
   }catch(err) {
    console.log(err);
    next()
   }
  },
  details: async(req, res) => {
   try{
    req.session.mobile = req.body.mobile
    const exmobile =await userHelper.existmobile(req.body.mobile)
    const exemail =await userHelper.existemail(req.body.email)
         if (exmobile && exemail) {
           req.session.alreadyexist = 'Your is already registerd Please Login'
           res.redirect('/signup')
         } else if (exmobile) {
           req.session.alreadyexist = 'Your mobile number is Registerd'
           res.redirect('/signup')
         } else if (exemail) {
           req.session.alreadyexist = 'Your Email is Registerd'
           res.redirect('/signup')
         } else {
           console.log(req.body);
           userHelper.adduser(req.body).then((result) => {
             if (result) {
               req.session.adduserid = result._id
               verificationotp.massegesend(req.body.mobile)
               res.redirect('/signup/otpvarification')
             } else if (!result) {
               res.redirect('back')
             }
           })
         }
   }catch(err) {
    console.log(err);
    next()
   }
  },
  otpvarification: (req, res,next) => {
    try{
      if (req.session.userlogin) {
        res.redirect('/home')
      } else if (req.session.adminlogin) {
        res.redirect('/Dashbord')
      } else {
        const mobile = req.session.mobile
        res.render('signup/otp', {mobile})
      }
    }catch(err) {
      console.log(err);
      next()
    }
  },
  otpchecking: async(req, res,next) => {
    try{
      const done =await verificationotp.messageverifycation(req.body.mobile,req.body.otp)
        const data =await userHelper.statustrue(req.session.mobile)
           if (data) {
             res.redirect("/login")
           }else{
             console.log('status changing is failed');
           }
    }catch(err) {
      console.log(err);
      next()
    }
  },
  login: (req, res,next) => {
   try{
    if (req.session.userlogin) {
      res.redirect('/home')
    } else if (req.session.adminlogin) {
      res.redirect('/Dashbord')
    } else if (!req.session.userlogin && !req.session.adminlogin) {
      const mismatch = req.session.mismatch
      req.session.mismatch = ''
      res.render('login', {
        mismatch
      })
    }
   }catch(err) {
    console.log(err);
    next()
   }
  },
  postlogin: async(req, res,next) => {
     try{
      const adminmobile = 9874561230
      const adminpassword = 'admin@123'
     const result =await userHelper.loginuser(req.body)
        if (result) {
          if (result.button) {
            if (result.status) {
              req.session.userlogin = result._id
              req.session.username = result.firstname + ' ' + result.lastname
              res.redirect('/home')
            } else {
              req.session.mobile = req.body.mobile
              res.redirect('/signup/resendmessage')
            }
  
          } else {
            res.render('home/blocked')
          }
        } else if (req.body.mobile == adminmobile && req.body.password == adminpassword) {
          req.session.mismatch = ''
          req.session.adminlogin = req.body.mobile
          res.redirect('/Dashbord')
        } else {
          req.session.mismatch = "Mobile or Password inccorect"
          res.redirect('/login')
        }
     }catch(err) {
      console.log(err);
      next()
     }
  },
  resend_message: (req, res) => {
    
    res.redirect('/signup/otpvarification')
  }

}