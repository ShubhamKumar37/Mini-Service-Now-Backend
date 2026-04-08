import joi from "joi";

export const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    otp: joi.string().required(),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().min(6).max(6).required(),
    newPassword: joi.string().min(3).max(12).required(),
});

export const otpSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().min(6).max(6).required(),
});