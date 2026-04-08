import prisma from "../config/prisma.js";

class userRepo {
    async createUser(data) {
        return await prisma.user.create({ data: data });
    }

    async getUserByEmail(email) {
        return await prisma.user.findUnique({ where: { email: email } });
    }

    async getUserById(id) {
        return await prisma.user.findUnique({ where: { id: id } });
    }

    async createOtp(data) {
        return await prisma.otp.create({ data: data });
    }

    async getOtp(email) {
        return await prisma.otp.findUnique({ where: { email: email } });
    }

    async updateUserDetails(userId, data) {
        return await prisma.user.update({ where: { id: userId }, data: data });
    }

    async deleteOtp(id) {
        return await prisma.otp.delete({ where: { id: id } });
    }

    async deleteExpireOtp() {
        return await prisma.otp.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    }
};

export default new userRepo();
