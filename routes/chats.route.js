const { Chat } = require("../models/chat.model");
const { User } = require("../models/user.model");
const { getUserFromRequest, getTokenFromRequest } = require('../modules/jwt');
const express = require("express");

const router = express.Router();


// returns all user chats
router.get("/", async (req, res) => {
  const token = getTokenFromRequest(req);
  const user = await User.getUserByToken(token);

  const chats = await Chat.getChatsByUserId(user._id);

  res.status(200).send(chats);
});

// returns chat with specific user or creates new one
router.get("/receiver/:receiver_id", async (req, res) => {
  const receiver_id = req.params.receiver_id;

  const chat = await Chat.getChatByReceiverId(receiver_id);
  res.status(200).send(chat);
});

// add new chat message
router.post("/:id/messages", async (req, res) => {
  const filter = {_id: req.params.id};
  const sender = getUserFromRequest(req);
  const { receiver_id, text } = req.body;
  const date = new Date();

  const message = {
    _id: chat.messages ? chat.messages.length : 0,
    sender,
    receiver_id,
    text,
    date,
    read: false
  };

  const chat = Chat.postChatMessage(filter, message);

  res.status(200).send(chat);
});

module.exports = router;
