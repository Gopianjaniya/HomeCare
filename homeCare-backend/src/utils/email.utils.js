const nodemailer = require("nodemailer");

function getTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS)
        throw Object.assign(
            new Error("Email delivery is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS."), { statusCode: 503 }
        );
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
}
async function sendVerificationEmail({ email, code }) {
    const transport = getTransport();
    let deliveryTimeout;
    const message = {
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Your HomeCare verification code",
        text: `Your HomeCare verification code is ${code}. It expires in 15 minutes. Do not share this code.`,
        html: `<p>Your HomeCare verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>It expires in 15 minutes. Do not share this code.</p>`,
    };

    try {
        await Promise.race([
            transport.sendMail(message),
            new Promise((_, reject) => {
                deliveryTimeout = setTimeout(() => {
                    transport.close();
                    reject(Object.assign(new Error("Email delivery timed out. Please try again."), { statusCode: 503 }));
                }, 15000);
            }),
        ]);
    } finally {
        clearTimeout(deliveryTimeout);
        transport.close();
    }
}
module.exports = { sendVerificationEmail };
