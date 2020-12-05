class CustomError extends Error {
    constructor(status, ...params) {
        super(...params);

        if (Error.captureStackTrace(this, CustomError));
        this.status = status;
    }
}

module.exports = CustomError;
