import jwt from "jsonwebtoken";
import { ErrorResponse } from "../utils/responses.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies || req.body || req.headers.authorization.split(" ")[1];
    next();
});