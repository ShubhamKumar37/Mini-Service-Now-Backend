import { NODE_ENV } from "../config/dotenv.js";

const erorrHandler = (err, req, res, next) => {
    console.log("Error:", err);

    return res.status(err.status || 500).json({
        success: err.success,
        message: err.message,
        error: err.error,
        ...(NODE_ENV === "dev" && { stack: err.stack }),
    });
}

export default erorrHandler;
