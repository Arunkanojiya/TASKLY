import axios from "axios";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";

dotenv.config();

/**
 * Send email using Brevo Email API (NO SMTP)
 */
export const sendEmail = async (to, subject, text) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "My App",
          email: process.env.BREVO_VERIFIED_EMAIL // must be verified in Brevo
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
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Email sent via Brevo API");
  } catch (error) {
    console.error(
      "Brevo Email Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Generate 6-digit OTP
 */
export const generateOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
