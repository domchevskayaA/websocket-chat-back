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

// creates new chat
router.post("/", async (req, res) => {
  const receiverId = req.body.receiver_id;
  const sender = getUserFromRequest(req);

  const chat = await Chat.createNewChat(sender._id, receiverId);
  res.status(200).send(chat);
});

// add new chat message
router.post("/:id/messages", async (req, res) => {
  const chatId = req.params.id;
  const sender = getUserFromRequest(req);
  const { text } = req.body;
  const date = new Date();

  const message = {
    sender,
    text,
    date,
    read: false
  };

  const chat = await Chat.postChatMessage(chatId, message);

  res.status(200).send(chat);
});

// returns chat with specific user or creates new one
router.get("/:id", async (req, res) => {
  const chatId = req.params.id;

  const chat = await Chat.getChatById(chatId);
  res.status(200).send(chat);
});

module.exports = router;
