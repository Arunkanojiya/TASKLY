import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `My App <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      text,
    });
    console.log("Email sent!");
  } catch (error) {
    console.log("Email Error:", error.message);
    throw error;
  }
};

export const generateOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
