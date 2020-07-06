const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = {
    createUserToken: (user) => {
       return user ? jwt.sign(user.toJSON(), config.get('myprivatekey')) : null;
    },

    getUserByToken: (token) => {
        return token ? jwt.verify(token, config.get('myprivatekey')) : null;
    },
}