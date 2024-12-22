import path from "path";
import { config } from "dotenv";

import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";

config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export default class Email {
  public to: string;
  public firstName: string;
  public url: string;
  public from: string;

  constructor(user: { email: string; firstName: string }, url: string) {
    if (!url) throw new Error("URL is required for sending email.");
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Abdulhakeem Gidado <${process.env.EMAIL_FROM}>`;

    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        "Email environment variables are not properly configured."
      );
    }
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else if (process.env.NODE_ENV === "test") {
      return nodemailer.createTransport({
        jsonTransport: true, // Mock transport for testing
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT as string, 10),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string) {
    try {
      const templatePath = path.resolve(
        __dirname,
        "../views/email",
        `${template}.pug`
      );
      const html = pug.renderFile(templatePath, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
      };

      console.log(`Sending email to ${this.to} with subject: ${subject}`);
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("There was an error sending the email. Try again later!");
    }
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  async sendResetPassword() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }

  async sendVerificationEmail() {
    await this.send(
      "verifyUser",
      "Please verify your mail using the link below"
    );
  }
}
