const nodemailer = require("nodemailer");

function getTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        throw Object.assign(
            new Error("Email delivery is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS."), { statusCode: 503 }
        );
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        logger: true,
        debug: true,
    });
}

async function sendVerificationEmail({ email, code }) {
    const transport = getTransport();

    const message = {
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Your HomeCare verification code",
        text: `Your HomeCare verification code is ${code}. It expires in 15 minutes. Do not share this code.`,
        html: `
            <p>Your HomeCare verification code is:</p>
            <h2>${code}</h2>
            <p>It expires in 15 minutes. Do not share this code.</p>
        `,
    };

    try {
        console.log("Checking SMTP connection...");
        console.log({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE,
            user: process.env.SMTP_USER,
        });
        await transport.verify();

        console.log("SMTP Connected Successfully");

        const info = await transport.sendMail(message);

        console.log("Email Sent Successfully");
        console.log(info);

        return info;

    } catch (err) {

        console.error("========== SMTP ERROR ==========");
        console.error(err);
        console.error("Message :", err.message);
        console.error("Code :", err.code);
        console.error("Command :", err.command);
        console.error("Response :", err.response);
        console.error("Stack :", err.stack);
        console.error("================================");

        throw err;

    } finally {
        transport.close();
    }
}

module.exports = {
    sendVerificationEmail,
};