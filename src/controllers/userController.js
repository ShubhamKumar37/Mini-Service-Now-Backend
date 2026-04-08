import { userService, emailService } from "../services/index.js";
import { ApiResponse, ErrorResponse, asyncHandler } from "../utils/index.js";

class userController {
    createUser = asyncHandler(async (req, res, next) => {
        const newUser = await userService.createUser(req.body);
        return new ApiResponse(200, "User created successfully", newUser);
    });

    loginUser = asyncHandler(async (req, res, next) => {
        const { refreshToken, accessToken, userExist } = await userService.loginUser(req.body);
        if (!userExist) throw new ErrorResponse(404, "User not found");

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return new ApiResponse(200, "User logged in successfully", { ...userExist, accessToken });
    });

    renewAccessToken = asyncHandler(async (req, res, next) => {
        const { accessToken } = await userService.renewAccessToken(req);

        return new ApiResponse(200, "Access Token renewed successfully", { accessToken });
    });

    sendOtpSignUp = asyncHandler(async (req, res, next) => {
        const { message } = await emailService.sendOtpForSignup(req.body);

        return new ApiResponse(200, message);
    });

    sendOtpResetPassword = asyncHandler(async (req, res, next) => {
        const { message } = await emailService.sendOtpForResetPassword(req.body);

        return new ApiResponse(200, message);
    });

    resetPassword = asyncHandler(async (req, res, next) => {
        const { message } = await userService.resetPassword(req.body);

        return new ApiResponse(200, message);
    });

};

export default new userController();