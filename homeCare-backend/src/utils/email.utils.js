const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function deliveryError(message, cause) {
    return Object.assign(new Error(message), {
        statusCode: 503,
        cause,
    });
}
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("EMAIL_USER:", process.env.SMTP_USER);
console.log("EMAIL_PASS exists:", !!process.env.SMTP_PASS);

async function sendVerificationEmail({ email, code }) {
    try {

        await transporter.sendMail({
            from: `"HomeCare" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "HomeCare Email Verification",

            text: `Your verification code is ${code}. This code is valid for 15 minutes.`,

            html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>HomeCare</h2>

          <p>Hello,</p>

          <p>Your verification code is:</p>

          <h1 style="letter-spacing:4px;color:#2563eb">
            ${code}
          </h1>

          <p>This code will expire in <b>15 minutes</b>.</p>

          <p>If you didn't request this code, you can ignore this email.</p>

          <br>

          <p>Thanks,</p>
          <p><b>HomeCare Team</b></p>
        </div>
      `,
        });

        return true;
    } catch (error) {
        console.error("============== SMTP ERROR ==============");
        console.error(error);
        console.error("Code:", error.code);
        console.error("Response:", error.response);
        console.error("Command:", error.command);

        throw error;
    }
}

module.exports = {
    sendVerificationEmail,
};