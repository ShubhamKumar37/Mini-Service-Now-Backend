class ApiResponse {
    constructor(status, data, message = "Successfully done") {
        this.status = status;
        this.data = data;
        this.message = message;
        this.success = status < 400;
    }
}

class ErrorResponse extends Error {
    constructor(status = 500, message = "Something is wrong", error = []) {
        super(message);
        this.status = status;
        this.success = false;
        this.error = error;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ApiResponse, ErrorResponse };