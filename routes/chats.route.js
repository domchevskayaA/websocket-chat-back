const { Chat } = require("../models/chat.model");
const { User } = require("../models/user.model");
const { Message } = require("../models/message.model");
const { getUserFromRequest, getTokenFromRequest } = require('../modules/jwt');
const express = require("express");
const ServerError = require("../modules/error");

const router = express.Router();


// returns all user chats
router.get("/", async (req, res) => {
  const token = getTokenFromRequest(req);
  const currentUser = await User.getUserByToken(token);

  const chats = await Chat.getChatsByUserId(currentUser._id);

  res.status(200).send(chats);
});

// creates new chat
router.post("/", async (req, res) => {
  try {
    const companionId = req.body.companion_id;
    const currentUser = getUserFromRequest(req);
    const chat = await Chat.createNewChat(currentUser._id, companionId);
    res.status(200).send(chat);
  } catch(err) {
    next(err);
  }
});

// add new chat message
router.post("/:id/messages", async (req, res, next) => {
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
    next(err);
  }
});

// returns chat by id
router.get("/:id", async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const currentUser = getUserFromRequest(req);
  
    const chat = await Chat.getChatById(chatId, currentUser._id);
    res.status(200).send(chat);
  } catch(err) {
    next(err);
  }
});

module.exports = router;
