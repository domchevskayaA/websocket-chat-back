const { User } = require("../models/user.model");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getTokenFromRequest } = require('../modules/jwt');
const ServerError = require("../modules/error");

const router = express.Router();
router.use(authMiddleware);

router.get("/current", async (req, res) => {
  const token = getTokenFromRequest(req);
  const user = await User.getUserByToken(token);
  user ? res.send(user) : next(new ServerError(404, `Please, login!`));
});

router.get("/", async (req, res) => {
  const token = getTokenFromRequest(req);
  const users = await User.getAvailableUsers(token);
  res.send(users);
});

router.delete("/", async(req, res) => {
  await User.deleteAllUsers();
  res.status(200).send("Users were successfully deleted!");
});

module.exports = router;
