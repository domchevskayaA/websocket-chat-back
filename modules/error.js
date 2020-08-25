class ServerError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'ServerError';
        this.status = 'fail',
        this.statusCode = statusCode;
    };
};

module.exports = ServerError;