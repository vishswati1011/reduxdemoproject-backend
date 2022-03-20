const express = require('express')
const router =express.Router();
const sendMail = require('../config/sendMail')
const authController =require('../controllers/auth')

router.post('/signup',authController.signup);
router.post('/emailVerification',authController.emailVerification);
router.post(
	'/login',
	// check('email').isEmail().withMessage('Please enter a valid email').bail(),
	// check('pwd').trim().isLength({ min: 6 }).withMessage('Password Incorrect'),
	authController.login
);
router.get(
	'/getAllUser',authController.getAllUser
);
module.exports=router;
