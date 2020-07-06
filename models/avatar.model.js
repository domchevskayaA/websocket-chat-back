const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//simple schema
const AvatarSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    required: true
  }
});

const Avatar = mongoose.model('Avatar', AvatarSchema);

//function to validate user
const validate = (avatar) => {
  const schema = {
    image: Joi.string().required(),
    extension: Joi.string().required()
  };

  return Joi.validate(avatar, schema);
};

exports.Avatar = Avatar;
exports.validateAvatar = validate;
