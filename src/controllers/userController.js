import { userService } from "../services/index.js";
import { ApiResponse } from "../utils/responses.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

};

export default new userController();