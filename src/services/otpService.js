import { userRepo } from "../repositories/index.js";
import { ErrorResponse } from "../utils/responses.js";


class otpService {
    async generateOtp(email) {
        const userExist = await userRepo.getUserByEmail(email);
        if (!userExist) throw new ErrorResponse(404, "User not found");

        const otp = Math.floor(1000 + Math.random() * 9000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await userRepo.createOtp({ otp, email, expiresAt });
        return otp;
    }

    async verifyOtp(data) {
        const { email, otp } = data;

        const otpExist = await userRepo.getOtp(email);

        if (!otpExist || otpExist.otp !== otp.toString()) throw new ErrorResponse(400, "Invalid Otp");
        if (otpExist.expiresAt < new Date()) throw new ErrorResponse(400, "Otp Expired");

        await userRepo.deleteOtp(otpExist.id);

        return true;
    }
}

export default new otpService();