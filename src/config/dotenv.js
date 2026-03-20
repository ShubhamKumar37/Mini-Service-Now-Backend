import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 8080;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_HOST = process.env.MAIL_HOST;
const NODE_ENV = process.env.NODE_ENV;

export { PORT, MAIL_USER, MAIL_PASS, MAIL_HOST, NODE_ENV };