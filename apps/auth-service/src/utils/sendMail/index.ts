import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Render an Ejs email template
const randerEmailTemplate = async (tamplateName: string, data: Record<string, any>) => {
    const templatePath = path.join(process.cwd(), "apps", "auth-service", "src", "utils", "email-templates", `${tamplateName}.ejs`);

    return ejs.renderFile(templatePath, data);
}

export const sendEmail = async (to: string, subject: string, tamplateName: string, data: Record<string, any>) => {
    try {
        const html = await randerEmailTemplate(tamplateName, data);
        await transporter.sendMail({
            from: `<${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.log("Error sending email", error);
        return false;
    }
}