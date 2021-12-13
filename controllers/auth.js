const { sendMail } = require('../config/sendMail');
const key = require('../config/key');
const User =require('../models/User')
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');


exports.signup = async (req, res, next) => {
	try {

        const {email,fName,lName,pwd,phoneNo}=req.body;
        console.log(req.body);
        const checkUser =await User.findOne({email:email})
        console.log("checkUser",checkUser);
        const hash = await bcryptjs.hash(pwd, 12);
		const generateOTP = () => {
			var digits = '0123456789';
			let OTP = '';
			for (let i = 0; i < 6; i++) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}
			return OTP;
		};
		const otp = generateOTP();
		console.log(otp)
        if(!checkUser)
        {
            console.log("hash",hash);
            const user = new User({
                email,
                fName,
                lName,
                pwd:hash,
                phoneNo:phoneNo,
            })
            const savedUser = await user.save()
            console.log("savedUser",savedUser)
            sendMail(savedUser.email,otp,'account-verification');
            console.log("mailsent");
            const payload = {
				_id,
				fName,
				lName,
				org,
				email
			};

			const helper = async () => {
				savedUser.otp = '';
				await savedUser.save();
			};
			setTimeout(() => {
				helper();
			}, 900000);
            jwt.sign(
				payload,
				key.secretKey,
				{
					expiresIn: 14400,
				},
				(err, token) => {
					res.json({
						success: true,
						message: 'An otp has been sent to you email',
					});
				}
			);
        }else{
            res.json({
                success: true,
                message: 'User Already Exists',
            });
        }
    }catch(err)
    {
    }
}