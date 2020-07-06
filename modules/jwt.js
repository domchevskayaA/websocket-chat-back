const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = {
    createUserToken: (user) => {
       return user ? jwt.sign(user.toJSON(), process.env.MY_PRIVATE_KEY) : null;
    },

    getUserByToken: (token) => {
        return token ? jwt.verify(token, process.env.MY_PRIVATE_KEY) : null;
    },
}