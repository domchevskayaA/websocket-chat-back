const { User } = require("../models/user.model");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  const users = await User.getAvailableUsers(token);
  res.send(users);
});

router.get("/current", async (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).send("User doesn't exist. Please, register.");
  res.send(user);
});

router.delete("/", async(req, res) => {
  await User.deleteAllUsers();
  res.status(200).send("Users were successfully deleted!");
});

module.exports = router;
