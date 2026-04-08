import { userRepo } from "../repositories/index.js";
import { ErrorResponse } from "../utils/responses.js";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { otpService } from "./index.js";
import { departmentService, regionService, teamService } from "./index.js";

class userService {
    async createUser(data) {
        const { name, email, password, otp, regionId = 1, departmentId = 1, teamId = 1, designation = "Software Engineer" } = data;

        const userExist = await userRepo.getUserByEmail(email);

        if (userExist) throw new ErrorResponse(400, "User already exists");
        if (!(await otpService.verifyOtp({ email, otp }))) throw new ErrorResponse(400, "Invalid Otp");

        await regionService.getRegion({ regionId });
        await departmentService.getDepartment({ departmentId });
        await teamService.getTeam({ teamId });

        password = await bcrypt.hash(password, 10);
        const userData = {
            name,
            empId: `EMP-${Date.now()}`,
            email,
            password,
            profileImage: `https://ui-avatars.com/api/?name=${name}`,
            role: UserRole.USER,
            regionId,
            teamId,
            departmentId,
            designation,
        };

        return await userRepo.createUser(userData);
    }

    async loginUser(data) {
        const { email, password } = data;

        const userExist = await userRepo.getUserByEmail(email);
        if (!userExist) throw new ErrorResponse(404, "User not found");

        const isPasswordValid = await bcrypt.compare(password, userExist.password);
        if (!isPasswordValid) throw new ErrorResponse(400, "Invalid Password");

        const refreshToken = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const accessToken = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        await userRepo.updateUserDetails(userExist.id, { accessToken });

        return { refreshToken, accessToken, userExist };
    }

    async renewAccessToken(data) {
        const { refreshToken } = data.cookies;
        const { id } = data.user;

        const userExist = await userRepo.getUserById(id);
        if (!userExist) throw new ErrorResponse(404, "User not found");

        const isRefreshTokenValid = jwt.verify(refreshToken, process.env.JWT_SECRET);
        if (!isRefreshTokenValid || userExist.refreshToken !== refreshToken) {
            await userRepo.updateUserDetails(userExist.id, { refreshToken: null });
            throw new ErrorResponse(400, "Invalid Refresh Token");
        }

        const accessToken = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        await userRepo.updateUserDetails(userExist.id, { accessToken });

        return { accessToken };
    }

    async resetPassword(data) {
        const { email, otp, newPasswrod } = data;

        const userExist = await userRepo.getUserByEmail(email);
        if (!userExist) throw new ErrorResponse(404, "User not found");

        await otpService.verifyOtp({ email, otp });

        newPasswrod = await bcrypt.hash(newPasswrod, 10);
        await userRepo.updateUserDetails(userExist.id, { password: newPasswrod });

        return { message: "Password reset successfully" };
    }

};

export default new userService();