"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
const html_to_text_1 = require("html-to-text");
(0, dotenv_1.config)();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
class Email {
    constructor(user, url) {
        if (!url)
            throw new Error("URL is required for sending email.");
        this.to = user.email;
        this.firstName = user.firstName;
        this.url = url;
        this.from = `Abdulhakeem Gidado <${process.env.EMAIL_FROM}>`;
        if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
            throw new Error("Email environment variables are not properly configured.");
        }
    }
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return nodemailer_1.default.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
        else if (process.env.NODE_ENV === "test") {
            return nodemailer_1.default.createTransport({
                jsonTransport: true, // Mock transport for testing
            });
        }
        return nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templatePath = path_1.default.resolve(__dirname, "../views/email", `${template}.pug`);
                const html = pug_1.default.renderFile(templatePath, {
                    firstName: this.firstName,
                    url: this.url,
                    subject,
                });
                const mailOptions = {
                    from: this.from,
                    to: this.to,
                    subject,
                    html,
                    text: (0, html_to_text_1.convert)(html),
                };
                console.log(`Sending email to ${this.to} with subject: ${subject}`);
                yield this.newTransport().sendMail(mailOptions);
            }
            catch (error) {
                console.error("Error sending email:", error);
                throw new Error("There was an error sending the email. Try again later!");
            }
        });
    }
    sendWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send("welcome", "Welcome to the Natours Family!");
        });
    }
    sendResetPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send("passwordReset", "Your password reset token (valid for only 10 minutes)");
        });
    }
    sendVerificationEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send("verifyUser", "Please verify your mail using the link below");
        });
    }
}
exports.default = Email;
