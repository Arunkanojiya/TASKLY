import axios from "axios";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, text) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "My App",
          email: process.env.BREVO_VERIFIED_EMAIL // MUST be verified
        },
        to: [{ email: to }],
        subject,
        htmlContent: `
          <p>${text}</p>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          "accept": "application/json"
        }
      }
    );

    console.log("✅ Email sent via Brevo API");
  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const generateOtp = () =>
  otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
