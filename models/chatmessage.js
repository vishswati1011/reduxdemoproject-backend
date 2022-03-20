const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatmessage = new Schema(
  {
    chatroom: { type: mongoose.Schema.Types.ObjectId, ref: "chatroom" },
    message: { type: Object },
    type: { type: String, default: "text" },
    postedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model('chatmessage', chatmessage)