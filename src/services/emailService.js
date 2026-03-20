import nodemailer from "nodemailer";
import { MAIL_USER, MAIL_PASS, MAIL_HOST } from "../config/dotenv.js";
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
}

export const sendEmail = async ({ to, cc, bcc, subject, text, html }) => {
    const mailOptions = {
        from: MAIL_USER,
        to: normalizeEmails(to),
        cc: normalizeEmails(cc),
        bcc: normalizeEmails(bcc),
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.rejected.length > 0) {
            throw new ErrorResponse(500, "Failed to send email", info.rejected);
        }
        console.log("Email sent successfully");
    }
    catch (error) {
        throw new ErrorResponse(500, "Failed to send email", [error.message]);
    }
};

export const testMail = async () => {
    try {
        await sendEmail({
            to: ["shubhamkumar200334@gmail.com"],
            subject: "Test Email",
            cc: ["darkshubham3@gmail.com"],
            bcc: ["sk9818281820@gmail.com"],
            text: "This is a test email",
            html: "<h1>This is a test email</h1>",
        });
        console.log("Test email sent successfully");
    } catch (error) {
        console.log(error);
    }
}