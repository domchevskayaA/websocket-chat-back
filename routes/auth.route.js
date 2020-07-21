const express = require("express");
const { User, validateUser } = require("../models/user.model");
const bcrypt = require("bcrypt");

const router = express.Router();

const { saveAvatar } = require('../modules/file');

router.post("/login", async (req, res) => {
  const { body: { email, password } } = req;
  const user = await User.findOne({ email});

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send("Wrong user password!");

    // res.cookie(
    //   'token',
    //   user.token,
    //   { path: '/',
    //   })

    res.send(user);
  } else {
    return res.status(401).send("User with this email doesn't exist. Please, register.");
  }  
});

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with this email is already registered.");
  const users = await User.find({});
  const userId = users.length;
  const avatar_url = await saveAvatar(req.body.avatar, `${req.body.name}${userId}`);

  user = new User({
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, 10),
    email: req.body.email,
    _id: userId,
    avatar_url,
  });
  user.token = user.generateAuthToken();
  await user.save();  

  // res.cookie(
  //   'token',
  //   user.token,
  //   { path: '/',
  //   })
  
  res.send(user);
});

router.post("/logout", async (req, res) => {
  // res.clearCookie("token").status(200).send("You are successfully logged out!");
  res.status(200).send("You are successfully logged out!");
});

module.exports = router;