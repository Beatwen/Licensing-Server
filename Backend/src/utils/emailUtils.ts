import nodemailer from "nodemailer";
import License from "../models/licensing";

// Configuration du transporteur
const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,   
    },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}

export async function sendConfirmationEmail(to: string, token: string, freeLicense: License): Promise<void> {
    console.log("Sending confirmation email to:", process.env.EMAIL_USER);
    const confirmationUrl = `http://localhost:3000/auth/confirm-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Please, confirm your email",
        html: `
            <h1>Welcome!</h1>
            <p>Thank you for signing up. Please confirm your email by clicking the link below:</p>
            <a href="${confirmationUrl}">Confirm my email</a>
            <p>Here is your free license key: <strong>${freeLicense.licenseKey}</strong></p>
        `,
    };
    await transporter.sendMail(mailOptions);
}
