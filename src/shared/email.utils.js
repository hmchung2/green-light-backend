import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // or host and port
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});


export const sendEmail = async (to, subject, text) => {
  try {
    const result = await transporter.sendMail({
      from: `"Green Light" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", result.response);
    return result;
  } catch (error) {
    console.error("❌ sendEmail error:", error);
    throw error;
  }
};
