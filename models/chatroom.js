const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatroom = new Schema(
  {
    roomid: { type: String },
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("chatroom", chatroom);
