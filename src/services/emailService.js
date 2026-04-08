import nodemailer from "nodemailer";
import { MAIL_USER, MAIL_PASS, MAIL_HOST, RESET_LINK } from "../config/dotenv.js";
import { ErrorResponse } from "../utils/responses.js";


const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

const normalizeEmails = (emails) => {
    if (!emails) return null;
    else return Array.isArray(emails) ? emails : [emails];
};

const sendEmail = async ({ to, cc, bcc, subject, text, html }) => {
    const emailOptions = {
        from: MAIL_USER,
        to: normalizeEmails(to),
        cc: normalizeEmails(cc),
        bcc: normalizeEmails(bcc),
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(emailOptions);
        if (info.rejected.length > 0) {
            throw new ErrorResponse(500, "Failed to send email", info.rejected);
        }
        console.log("Email sent successfully");
    }
    catch (error) {
        throw new ErrorResponse(500, "Failed to send email", [error.message]);
    }
};

class emailService {
    sendOtpForSignup = async (data) => {
        const { email, otp } = data;
        const emailOption = {
            to: email,
            subject: "OTP for signup",
            html: `<h1>This is the otp = ${otp}</h1>`
        };

        await sendEmail(emailOption);
        return { message: "Otp sent successfully" };
    }

    sendOtpForResetPassword = async (data) => {
        const { email, otp } = data;
        const emailOption = {
            to: email,
            subject: "OTP for Reset password",
            html: `<h1>This is the otp = ${otp}</h1>
             <h2> <a href=${RESET_LINK} target="_blank">Click me to reset</a>
            </h2>`
        };

        await sendEmail(emailOption);
        return { message: "Otp sent successfully" };
    }
}

export default new emailService();