const sendMail = require('../config/sendMail');
const key = require('../config/key');
const User =require('../models/User')
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const e = require('express');


exports.signup = async (req, res) => {
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
				otp,
                pwd:hash,
                phoneNo,
            })
            const savedUser = await user.save()
            console.log("savedUser",savedUser)
			console.log("savedUser.email",savedUser.email)
            sendMail(savedUser.email,otp,'account-verification');
            console.log("mailsent");
			const _id=savedUser._id;
			const payload = {
					_id,
					fName,
					lName,
					phoneNo,
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
							result:payload,
							success: true,
							message: 'An otp has been sent to you email',
						});
					}
				);	
        }else{
            res.staus(400).json({
                success: false,
                message: 'User Already Exists',
            });
        }
    }catch(err)
    {
		res.staus(400).json({
			success: false,
			message: 'Error in register user',
		});
    }
}

exports.emailVerification = async (req, res) => {
	try{
	const {email,otp}=req.body;
	var checkUser=await User.findOne({email});
	if(!checkUser)
	{
		res.status(401).json({
			success:false,
			message:'Invalid Email'
		})
	}
	if(checkUser.otp!==otp)
	{
		res.status(401).json({
			success:false,
			message:'Invalid otp'
		})
	}
	checkUser.otp='';
	const saveUser = await checkUser.save();
	const {_id,phoneNo,fName,lName}=saveUser;
	const payload = {
		_id,
		email,
		fName,
		lName,
		phoneNo
	}
	jwt.sign(
		payload,
		key.secretKey,
		{
			expiresIn: 14400,
		},
		(err,token)=>{
			res.status(200).json({
				result:payload,
				success:true,
				token: 'Bearer ' + token,
				message:'Email Varification Successfull'
			})
		}
	)
	}catch(err)
	{
		console.log("Error in email varification")
		res.status(400).json({
			success:false,
			message:'Error in email varification '
		})
	}
}

exports.login = async (req,res) => {

	try{
		const {email,password}=req.body;
		console.log("user",req.body)
		const user = await User.findOne({email})
		if(!user){
			res.status(400).json({
				success:false,
				message:"Invalid Email"
			})
		}
		if(user)
		{
			if((await bcryptjs.compare(password, user.pwd)))
			{
				const {_id,fName,lName,phoneNo}=user;
				const payload = {
					_id,
					email,
					fName,
					lName,
					phoneNo
				}
				jwt.sign(
					payload,
					key.secretKey,
					{
						expiresIn:14400
					},
					(err,token) => {
						res.status(200).json({
							payload,
							success:true,
							token:"Bearer " +token,
							message:"Login successfully complete"
						})
					}
				)
			}else{
				res.status(400).json({
					success:false,
					message:"Invalid password"
				})
			}
		}
	}catch(err){
		res.status(400).json({
			success:false,
			message:"Invalid email and password"
		})
	}
}