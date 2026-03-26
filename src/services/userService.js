import { userRepo } from "../repositories/index.js";
import { ErrorResponse } from "../utils/responses.js";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class userService {
    async createUser(data) {
        const { name, email, password, otp } = data;

        const userExist = await userRepo.getUserByEmail(email);

        if (userExist) throw new ErrorResponse(400, "User already exists");
        if (!(await this.verifyOtp({ email, otp }))) throw new ErrorResponse(400, "Invalid Otp");

        password = await bcrypt.hash(password, 10);
        const userData = {
            name,
            empId: `EMP-${Date.now()}`,
            email,
            password,
            profileImage: `https://ui-avatars.com/api/?name=${name}`,
            role: UserRole.USER,
            regionId: 1,
            teamId: 1,
            departmentId: 1,
            designationId: data.designation || "Software Engineer",
        };

        return await userRepo.createUser(userData);
    }

    async generateOtp(email) {
        const userExist = await userRepo.getUserByEmail(email);
        if (!userExist) throw new ErrorResponse(404, "User not found");

        const otp = Math.floor(1000 + Math.random() * 9000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        return await userRepo.createOtp({ otp, email, expiresAt });
    }

    async verifyOtp(data) {
        const { email, otp } = data;

        const otpExist = await userRepo.getOtp(email);

        if (!otpExist || otpExist.otp !== otp.toString()) throw new ErrorResponse(400, "Invalid Otp");
        if (otpExist.expiresAt < new Date()) throw new ErrorResponse(400, "Otp Expired");

        await userRepo.deleteOtp(otpExist.id);

        return true;
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

};

export default new userService();