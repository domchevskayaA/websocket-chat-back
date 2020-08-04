const { Chat } = require("../models/chat.model");
const { User } = require("../models/user.model");
const { getUserFromRequest, getTokenFromRequest } = require('../modules/jwt');
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const token = getTokenFromRequest(req);
  const user = await User.getUserByToken(token);

  let chats = await Chat.getChatsByUserId(user._id);

  res.status(200).send(chats);
});

router.get("/receiver/:receiver_id", async (req, res) => {
  const sender = getUserFromRequest(req);
  const receiver_id = req.params.receiver_id;
  const filter = {users: {$all: [receiver_id, sender._id]}};

  let chat = await Chat.findOneAndUpdate(
    filter, {
      $set: { 'messages.$[].read': true }
    }, (err, chat) => {
      // console.log(err, chat);
    }).populate({
      path: 'users',
      select: 'name avatar',
      match: { _id: {$ne: userId }},
    });

  if (!chat) {
    chat = new Chat({
      users: [receiver_id, sender._id],
      messages: []
    }).populate({
      path: 'users',
      select: 'name avatar',
      match: { _id: {$ne: userId }},
    });
    await chat.save();
  }

  res.status(200).send(chat);
});

router.post("/:id/messages", async (req, res) => {
  const filter = {_id: req.params.id};
  const sender = getUserFromRequest(req);
  const { receiver_id, text } = req.body;

  let chat = await Chat.findOne(filter);
  const date = new Date();

  const data = {
    _id: chat.messages ? chat.messages.length : 0,
    sender,
    receiver_id,
    text,
    date,
    read: false
  };

  if (!chat) {
    return res.status(404).send("Chat not found.");
  } else {
    chat = await Chat.findOneAndUpdate(
      filter,
      {$push: {messages: data}},
      {new: true})
  }

  res.status(200).send(chat);
});

module.exports = router;
