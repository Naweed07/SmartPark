import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
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
                },
            });
        } else {
            // Generate ethereal testing credentials
            console.warn("⚠️ No SMTP credentials found in .env! Generating an Ethereal test account...");
            const testAccount = await nodemailer.createTestAccount();

            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
        }

        const info = await transporter.sendMail({
            from: '"SmartPark Notifications" <noreply@smartpark.com>', // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
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
