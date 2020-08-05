const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//simple schema
const ChatSchema = new mongoose.Schema({
  messages: {
    type: [Object],
    required: true,
    default: [],
  },
  users: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
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
    return this.find({ users: userId }).populate(getPopulateUsersObject(userId))
    .catch(err => {
      console.error(err);
      throw err;
    })
};

ChatSchema.statics.createNewChat = async function(senderId, receiverId) {
    chat = new Chat({
      users: [receiverId, senderId],
    });
  await chat.save();

  return chat.populate(getPopulateUsersObject(senderId));
};

ChatSchema.statics.getChatById = async function(chatId) {
  const chat = this.findById(chatId);
  return chat ? chat : es.status(404).send("Chat not found.");
};

ChatSchema.statics.postChatMessage = async function(chatId, message) {
  let chat = await this.findById(chatId);

  if (!chat) {
    return res.status(404).send("Chat not found.");
  } else {
    message._id = chat.messages.length;
    chat = await this.findByIdAndUpdate(
      chatId,
      {$push: {messages: message}},
      {new: true})
  };

  return chat;
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
