const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//simple schema
const ChatSchema = new mongoose.Schema({
  user_ids: {
    type: Array,
    required: true
  },
  messages: {
    type: Array,
    required: true
  }
});

const Chat = mongoose.model('Chat', ChatSchema);

//function to validate user
const validate = (item) => {
  const schema = {
    user_ids: Joi.array().required(),
    messages: Joi.array().required()
  };

  return Joi.validate(item, schema);
};

exports.Chat = Chat;
exports.validate = validate;
