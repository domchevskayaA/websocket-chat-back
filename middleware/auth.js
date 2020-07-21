const { getUserByToken } = require('../modules/jwt');

module.exports = (req, res, next) => {
  //get the token from headers if present
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  //if no token found, return response (without going to the next middleware)
  if (!token) return res.status(401).send("Please, authorize first.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    req.user = getUserByToken(token);
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
};
