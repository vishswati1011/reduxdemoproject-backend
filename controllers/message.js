const messageModel = require('../models/messageModel')


exports.addMessage = async (req, res) => {

    try {
        const {from , to ,message} =req.body;
        const data =await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from,
        });
        if(data) return res.json({msg:"message added"});
        return res.json({msg:"failed to add message to the database"})
    } catch (err) {
        console.log("error", err)
    }
}


exports.getAllMessage = async (req, res) => {

    try{
        const {from, to} =req.body;
        console.log(from,"from",to)
        const message= await messageModel.find({ users: { $all: [ from,to ] } })
        .sort({updatedAt:1});
        console.log("message======",message)
        const projectMessage =message.map((msg)=>{
            return{
                fromSelf:msg.sender.toString()===from,
                message:msg.message.text,
            };

        })
        res.json({
            status:false,
            result:projectMessage,
            message:"All message here"})
    }catch(err)
    {
        console.log("error", err)

    }
}

// db.messages.find({users: { $all: [ "62342073c419dac72740e012","6234113d5e50757301782875"  ] } }).pretty()
// db.messages.find({users: { $all: [ "6234113d5e50757301782875" , "62342073c419dac72740e012" ] } }).pretty()



