const { Chat } = require("../models/chat.model");
const { User } = require("../models/user.model");
const { Message } = require("../models/message.model");
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
  try {
    const companionId = req.body.companion_id;
    const user = getUserFromRequest(req);
    const chat = await Chat.createNewChat(user._id, companionId);
    res.status(200).send(chat);
  } catch(err) {
    res.send(err);
  }
});

// add new chat message
router.post("/:id/messages", async (req, res) => {
  try {
    const chatId = req.params.id;
    const sender = getUserFromRequest(req);
    const { text } = req.body;
  
    const message = new Message({
      sender,
      text,
    });
  
    const chat = await Chat.postChatMessage(chatId, message);  
    res.status(200).send(chat);
  } catch(err) {
    res.status(404).send(err.message);
  }
});

// returns chat by id
router.get("/:id", async (req, res) => {
  try {
    const chatId = req.params.id;
  
    const chat = await Chat.getChatById(chatId);
    res.status(200).send(chat);
  } catch(err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
