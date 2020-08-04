const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//simple schema
const ChatSchema = new mongoose.Schema({
  messages: {
    type: [Object],
    required: true
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

ChatSchema.statics.getChatByReceiverId = async function(receiverId) {
  const sender = getUserFromRequest(req);
  const filter = {users: {$all: [receiverId, sender._id]}};

  let chat = await this.findOneAndUpdate(
    filter, {
      $set: { 'messages.$[].read': true }
    }, (err, chat) => {
    }).populate(getPopulateUsersObject(sender._id));

  if (!chat) {
    chat = new Chat({
      users: [receiverId, sender._id],
      messages: []
    }).populate(populateUsersObject);
    await chat.save();
  };

  return chat;
};

ChatSchema.statics.postChatMessage = async function(filter, message) {

  let chat = await this.findOne(filter);

  if (!chat) {
    return res.status(404).send("Chat not found.");
  } else {
    chat = await this.findOneAndUpdate(
      filter,
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
