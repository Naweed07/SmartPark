import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, attachments }) => {
    try {
        // Create an Ethereal test account (Fake SMTP Service)
        // If the user hasn't provided their own creds in .env, this will generate random test credentials
        let transporter;

        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Use real credentials from .env
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT || 587,
                secure: process.env.EMAIL_PORT == 465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });
        }

        const info = await transporter.sendMail({
            from: '"SmartPark Notifications" <noreply@smartpark.com>', // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
            attachments: attachments || []
        });

        console.log("Email sent: %s", info.messageId);

        // If using Ethereal, log the preview URL so the user can see the email in their browser
        if (!process.env.EMAIL_HOST) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default sendEmail;
