import { userService } from "../services/index.js";
import { ApiResponse } from "../utils/responses.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class userController {
    createUser = asyncHandler(async (req, res, next) => {
        const newUser = await userService.createUser(req.body);
        return new ApiResponse(200, "User created successfully", newUser);
    });

    loginUser = asyncHandler(async (req, res, next) => {
    });

};

export default new userController();