const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const { User } = require("../models/user.model");
const { MessageSchema } = require("../models/message.model");

//simple schema
const ChatSchema = new mongoose.Schema({
  messages: {
    type: [MessageSchema],
    default: [],
  },
  users_ids: {
    type: [mongoose.Types.ObjectId]
  },
  companion: {
    type: {
      email: String,
      name: String,
      avatar: String,
    }
  },
  count: {
    type: Number,
    default: 1,
  }
});

//custom method to generate authToken
const getPopulateUsersObject = (userId) => {
  return {
    path: 'users',
    select: 'name avatar',
    match: { _id: {$ne: userId }},
  };
};

ChatSchema.statics.getChatsByUserId = function(userId) {
  return this.find({ users_ids: userId }, 'companion count')
  .catch(err => {
    console.error(err);
    throw err;
  });
};

ChatSchema.statics.createNewChat = async function(userId, companionId) {
  const companion = await User.getUserById(companionId);
  let chat = await this.findOne({users: {$all: [userId, companionId]}});
  if (!chat) {
    chat = new Chat({
      users_ids: [userId, companionId],
      companion,
    });
    await chat.save();
  } else {
    console.log(err);
    throw new Error('Chat already exists.');
  }
  return chat;
};

ChatSchema.statics.getChatById = async function(chatId) {
  return this.findById(chatId)
  .catch(err => {
    console.error(err);
    throw err;
  })
};

ChatSchema.statics.postChatMessage = async function(chatId, message) {
  return this.findByIdAndUpdate(
    chatId,
    {$push: {messages: message}},
    {new: true}
  )
  .catch(err => {
    console.error(err);
    throw err;
  })
};

const Chat = mongoose.model('Chat', ChatSchema);

//function to validate user
const validate = (item) => {
  const schema = {
    users: Joi.array().required(),
    messages: Joi.array().required()
  };

  return Joi.validate(item, schema);
};

exports.Chat = Chat;
exports.validate = validate;
