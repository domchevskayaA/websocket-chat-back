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
  users: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
});

ChatSchema.set('toObject', { virtuals: true });
ChatSchema.set('toJSON', { virtuals: true });

ChatSchema.virtual('unreadCount').get(function() {
  const unreadMessages = {};

  this.users.map(user => unreadMessages[user._id] = 0);
  if (!this.messages.length) return unreadMessages;

  this.messages.map(m => {
    !m.read ? unreadMessages[m.sender._id] += 1 : null;
  });
  return unreadMessages;
});

//custom method to generate authToken
const getPopulateUsersObject = (userId) => {
  return {
    path: 'users',
    select: 'name avatar email',
    // match: { _id: {$ne: userId }},
  };
};

ChatSchema.statics.getChatsByUserId = function(currentUserId) {
  return this.find({ users: currentUserId }).populate(getPopulateUsersObject())
  .catch(err => {
    console.error(err);
    throw err;
  });
};

ChatSchema.statics.createNewChat = async function(userId, companionId) {
  let chat = await this.findOne({users: {$all: [userId, companionId]}});
  if (!chat) {
    chat = new Chat({
      users: [userId, companionId],
    });
    await chat.save();
  } else {
    console.log(err);
    throw new Error('Chat already exists.');
  }
  return chat;
};

ChatSchema.statics.getChatById = async function(chatId, currentUserId) {
  return this.findByIdAndUpdate(
    chatId,
    {
      $set: { 'messages.$[element].read': true }
    },
    {
      arrayFilters: [ { 'element.sender._id': { $ne: currentUserId } } ],
      new: true,
    }
  )
  .catch(err => {
    console.error(err);
    throw err;
  })
};

ChatSchema.statics.postChatMessage = async function(chatId, message) {
  return this.findByIdAndUpdate(
    chatId,
    {
      $push: { messages: message },
      // $inc: { unreadCount : 1 }
    },
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
