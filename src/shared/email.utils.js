import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, text) => {
    console.log("Sending email to:", to);
    try {
        const result = await transporter.sendMail({
            from: `"Green Light" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("sendEmail() error:", error);
        throw error;
    }
};
