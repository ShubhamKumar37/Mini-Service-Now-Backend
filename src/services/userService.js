import { userRepo } from "../repositories/index.js";
import { ErrorResponse } from "../utils/responses.js";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

class userService {
    async createUser(data) {
        const { name, email, password } = data;

        const userExist = await userRepo.getUserByEmail(email);
        if (!userExist) throw new ErrorResponse(400, "User already exists");

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

        if (!otpExist) throw new ErrorResponse(404, "Invalid Otp");

        if (otpExist.otp !== otp.toString()) throw new ErrorResponse(400, "Invalid Otp");

        if (otpExist.expiresAt < new Date()) throw new ErrorResponse(400, "Otp Expired");

        await userRepo.deleteOtp(otpExist.id);

        return true;
    }

};

export default new userService();