const express = require("express");
const { User, validateUser } = require("../models/user.model");
const bcrypt = require("bcrypt");
const ServerError = require("../modules/error");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { body: { email, password } } = req;
  const user = await User.findOne({ email });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    isPasswordValid ? res.send(user) : next(new ServerError(401, 'Wrong user password.'));
  } else {
    next(new ServerError(401, `User with this email doesn't exist. Please, register.`));
  }  
});

router.post("/register", async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ email: req.body.email });
  if (user) next(new ServerError(400, `User with this email is already registered. Please, login.`));
  const { name, email, avatar } = req.body;

  user = new User({
    name,
    email,
    avatar,
    password: await bcrypt.hash(req.body.password, 10),
  });
  user.token = user.generateAuthToken();
  await user.save();  
  
  res.send(user);
});

router.post("/logout", async (req, res) => {
  res.status(200).send("You are successfully logged out!");
});

module.exports = router;