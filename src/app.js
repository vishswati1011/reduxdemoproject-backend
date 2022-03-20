const express = require('express');
const mongoose = require('mongoose');
const { Users } = require("../config/user");
const chatroom = require("../models/chatroom");
const User = require("../models/User");
const chatmessage = require("../models/chatmessage");
const cors = require('cors');
const authRoutes = require('../routes/auth')
const msgRoutes = require('../routes/msgRoute')

const app = express();
var server = require("http").createServer(app);
app.use(express.json());
app.use(cors());
let users = new Users();
// our routes
app.use('/auth', authRoutes);
app.use('/message', msgRoutes);

//step 1 11 to 12
// const io = require("socket.io")(server);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

global.onlineUsers=new Map();

//step-2  15 
let user = 0;
io.on("connection", (socket) => {


    global.chatSocket = socket;
    socket.on("add-user",(userid) => {
      console.log(userid);
      onlineUsers.set(userid,socket.id)
    });

    socket.on("send-msg",(data) => {
      console.log("send-msg",data)
      const sendUsersSocket = onlineUsers.get(data.to);
      console.log("sendUsersSocket",sendUsersSocket)
      if(sendUsersSocket) {
        socket.to(sendUsersSocket).emit("msg-recieve",data.message);
      }
    })


    socket.on("join", async (params, error) => {
    console.log("connection")

      let room = params.room;
      let name = params.name;
      let email = params.email;
      let _id = params._id;
  
      if (room.length < 0) {
        return error("Room name cannot be empty");
      }
      socket.join(room);
      users.removeUser(email);
      users.addUser(socket.id, name, room, email, _id);
      console.log("****", users.users);
      console.log(users.getUserList(room));
      io.to(params.room).emit("updateUsersList", users.getUserList(room));
      const chatRoom = await chatroom.findOne({ roomid: params.room });
      if (chatRoom) {
        var messages = await chatmessage
          .find({ chatroom: chatRoom._id })
          .populate("postedByUser", "fName");
        console.log("message",messages);
        messages = messages.map((ele) => {
          return { name: ele.postedByUser.fName, message: ele.message };
        });
        console.log("message1",messages);

        socket.emit("oldMessages", { messages });
      }
      let userid = [];
      users.users.map(async (ele) => {
        let user = await User.findOne({ email: ele.email });
        if (user) userid.push(user._id);
        if (params.room == ele.room) {
          let chatR = await chatroom.findOne({ roomid: room });
          if (!chatR) {
            let newChatRoom = await new chatroom({
              roomid: ele.room,
              userid: userid,
            });
            await newChatRoom.save();
          } else {
            if (chatR.userid.includes(user._id)) {
              console.log("hello");
            } else {
              chatR.userid.push(user._id);
            }
            await chatR.save();
          }
        }
      });
  
      socket.emit("newMessage", {
        name: "server",
        message: `${name} joined this chat`,
      });
      console.log("new user joined", socket.id);
      user += 1;
      console.log("Total user in subproject", user);
      console.log("room", room);
      socket.broadcast.to(room).emit("join", { msg: "New User Joined" });
    });
  
    socket.on("projectChanged", (params) => {
      let room = params.room;
      console.log("room", room);
      if (room.length < 0) {
        return error("Room name cannot be empty");
      }
      console.log("refresh the api");
      socket.broadcast.to(room).emit("projectChanged", { msg: "Refresh API" });
    });


    socket.on("createMessage", async (message) => {
			console.log("createMessage");

      console.log("**%%%%***", message);
      let user = users.getUser(message.email);
      console.log("room", user);
      if (user && message.text.length > 0) {
        const chatRoom = await chatroom.findOne({ roomid: user.room });
        const user1 = await User.findOne({ email: user.email });
        const newMessage = await new chatmessage({
          chatroom: chatRoom._id,
          message: message.text[0],
          postedByUser: user1._id,
        });
        await newMessage.save();
        io.sockets.to(user.room).emit("newMessage", { message: {name: user1.fName, message: newMessage.message} });
      }
    });
    
    socket.on("disconnect", () => {
      let user = users.removeUserBySocketId(socket.id);
  
      if (user) {
        io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
        io.to(user.room).emit("newMessage", {
          name: "server",
          message: `${user.name} has left chat.`,
        });
      }
    });
    
  });



// Connect Database
// mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_PORT}/${process.env.DATABASE}`).then(con=> {
mongoose.connect(`mongodb://localhost:27017/sendMailDB`).then(con=> {
    console.log("connected DB");
}).catch(err=>{
    console.log('error', err);
});

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

server.listen(port, () => console.log(`Server running on port ${port}`));