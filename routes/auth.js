const express = require('express')
const router =express.Router();
const sendMail = require('../config/sendMail')
const authController =require('../controllers/auth')

router.post('/signup',authController.signup);
router.post('/emailVerification',authController.emailVerification);

module.exports=router;
