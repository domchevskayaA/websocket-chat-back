const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const MessageSchema = new mongoose.Schema({
  chat_id: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender : {
    type: Object,
    required: true
  },
  read: {
    type: Boolean,
    required: true
  }
});

const Message = mongoose.model('Message', MessageSchema);

//function to validate user
const validate = (item) => {
  const schema = {
    chat_id: Joi.string().required(),
    message: Joi.string().required(),
    sender: Joi.object().required(),
    read: Joi.boolean().required(),
  };

  return Joi.validate(item, schema);
};

exports.Message = Message;
exports.validate = validate;
