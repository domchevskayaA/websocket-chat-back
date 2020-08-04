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
  }
});

ChatSchema.statics.getChatsByUserId = function(userId) {
    return this.find({ users: userId }).populate({
      path: 'users',
      select: 'name avatar',
      match: { _id: {$ne: userId }},
    })
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
