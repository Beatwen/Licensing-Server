import nodemailer from "nodemailer";
import License from "../models/licensing";

// Interface pour les données du formulaire de contact
export interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

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
    const confirmationUrl = `${process.env.APP_URL}/auth/confirm-email?token=${token}`;

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

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
    console.log("Sending password reset email to:", to);
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Password Reset Request",
        html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
            <p>This link will expire in 24 hours.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
    const { name, email, company, subject, message } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: `[RF.Go Contact] ${subject}`,
        html: `
            <h2>Nouveau message de contact - RF.Go</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Entreprise:</strong> ${company}</p>` : ''}
            <p><strong>Sujet:</strong> ${subject}</p>
            <div>
                <strong>Message:</strong>
                <p style="border-left: 3px solid #3B82F6; padding-left: 15px; margin-left: 10px;">
                    ${message.replace(/\n/g, '<br>')}
                </p>
            </div>
            <hr>
            <p style="color: #666; font-size: 12px;">
                Message envoyé depuis le formulaire de contact RF.Go - ${new Date().toLocaleString()}
            </p>
        `,
        replyTo: email
    };

    await transporter.sendMail(mailOptions);
}

export async function sendContactConfirmationEmail(data: ContactEmailData): Promise<void> {
    const { name, email, subject } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmation de réception - RF.Go',
        html: `
            <h2>Merci pour votre message !</h2>
            <p>Bonjour ${name},</p>
            <p>Nous avons bien reçu votre message concernant "<strong>${subject}</strong>".</p>
            <p>Notre équipe vous répondra dans les plus brefs délais.</p>
            <br>
            <p>Cordialement,<br>L'équipe RF.Go</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                Ceci est un message automatique, merci de ne pas y répondre.
            </p>
        `
    };

    await transporter.sendMail(mailOptions);
}
