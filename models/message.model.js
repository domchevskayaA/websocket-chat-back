const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender : {
    type: {
      email: String,
      name: String,
      avatar: String,
    }
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
		default: Date.now,
  }
});

const Message = mongoose.model('Message', MessageSchema);

//function to validate user
const validate = (item) => {
  const schema = {
    text: Joi.string().required(),
    sender: Joi.object().required(),
    read: Joi.boolean(),
  };

  return Joi.validate(item, schema);
};

exports.MessageSchema = MessageSchema;
exports.Message = Message;
exports.validate = validate;
