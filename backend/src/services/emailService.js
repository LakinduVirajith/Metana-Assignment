import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// CONFIGURE THE EMAIL TRANSPORTER USING EMAIL SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// FUNCTION TO SEND FOLLOW-UP EMAIL
export const sendFollowUpEmail = async (toEmail, applicantName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: "Thank You for Applying!",
            text: `Hi ${applicantName},\n\nThank you for submitting your application. Our team will review it and get back to you soon!\n\nBest regards,\nHR Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Follow-up email sent to ${toEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
