const {Chat} = require("../models/chat.model");
const { getUserFromRequest } = require('../modules/jwt');
const express = require("express");
// const authMiddleware = require("../middleware/auth");

const router = express.Router();
// router.use(authMiddleware);

router.get("/receiver/:receiver_id", async (req, res) => {
  const sender = getUserFromRequest(req);
  const receiver_id = parseInt(req.params.receiver_id);
  const filter = {user_ids: {$all: [receiver_id, sender._id]}};

  let chat = await Chat.findOneAndUpdate(
    filter, {
      $set: { 'messages.$[].read': true }
    }, (err, chat) => {
      // console.log(err, chat);
    });

  if (!chat) {
    chat = new Chat({
      user_ids: [receiver_id, sender._id],
      messages: []
    });
    await chat.save();
  }

  res.status(200).send(chat);
});

router.post("/:id/messages", async (req, res) => {
  const filter = {_id: req.params.id};
  const sender = getUserFromRequest(req);

  let chat = await Chat.findOne(filter, (err, chat) => {
    // console.log(err, chat);
  });
  const date = new Date();

  const data = {
    _id: chat.messages ? chat.messages.length : 0,
    sender: sender,
    text: req.body.text,
    date: date,
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
