const { getUserFromRequest } = require('../modules/jwt');

module.exports = (req, res, next) => {
  //if no token found, return response (without going to the next middleware)
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).send("Please, authorize first.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    req.user = user;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
};
