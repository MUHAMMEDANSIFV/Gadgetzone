var express = require('express');
var router = express.Router();
const dotenv = require('dotenv')
dotenv.config()
const authentication = require('../controllers/auth.controller')
/* GET users listing. */
router.get('/',authentication.signup);

  // signup details
   
router.post('/details',authentication.details)  

router.get('/otpvarification',authentication.otpvarification)

router.post('/otpchecking',authentication.otpchecking)

router.get('/resendmessage',authentication.resend_message)

module.exports = router;
