const jwt = require('jsonwebtoken');

module.exports = {
    createUserToken: (data) => {
       return data ? jwt.sign(JSON.stringify(data), process.env.MY_PRIVATE_KEY) : null;
    },

    getTokenFromRequest: (req) => {
        return req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    },

    getUserFromRequest: (req) => {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        return token ? jwt.verify(token, process.env.MY_PRIVATE_KEY) : null;
    },
}