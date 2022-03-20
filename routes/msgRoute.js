const express = require('express')
const router =express.Router();
const message =require('../controllers/message')

router.post('/getAllMessage',message.getAllMessage);
router.post('/addMessage',message.addMessage);

module.exports=router;
