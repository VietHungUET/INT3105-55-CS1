class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class APIError extends AppError {
    constructor(message = 'Internal Server Error', err) {
        super(message, 500);
        this.name = 'APIError';
        if (err) {
            this.originalError = err;
        }
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized Access') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    AppError,
    APIError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError
};