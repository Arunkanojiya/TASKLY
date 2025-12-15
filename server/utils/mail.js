import axios from "axios";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "My App",
          email: process.env.BREVO_SENDER_EMAIL, // VERIFIED EMAIL
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: `
          <h3>Your OTP</h3>
          <p><b>${otp}</b></p>
          <p>This OTP is valid for 10 minutes.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // xkeysib-****
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data.messageId);
  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.data || error.message
    );
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
