const { createUserToken } = require('../modules/jwt');
const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
  __v: {
    type: Number,
    select: false,
  },
  _id: {
    type: Number,
  },
  avatar_url: {
    type: String,
    required: false,
    default: null,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  token: {
    type: String,
    required: true,
  }
});


//custom method to generate authToken
UserSchema.methods.generateAuthToken = function() {
  return createUserToken(this);
};

UserSchema.statics.getAvailableUsers = function() {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  return new Promise((resolve, reject) => {
    this.find({token: {$ne: token}}, (err, docs) => {
      if(err) {
        console.error(err)
        return reject(err)
      }
      resolve(docs)
    })
  })
};

UserSchema.statics.deleteAllUsers = function() {
  return new Promise((resolve, reject) => {
    this.deleteMany({}, (err, docs) => {
      if(err) {
        console.error(err)
        return reject(err)
      }
      resolve(docs)
    })
  })
};

const User = mongoose.model('User', UserSchema);

//function to validate user
const validate = (user) => {
  const schema = {
    avatar: Joi.object().keys({
      image: Joi.string().base64().required(),
      extension: Joi.string().required(),
    }),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validateUser = validate;
