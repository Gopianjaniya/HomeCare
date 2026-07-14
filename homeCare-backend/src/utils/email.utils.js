const axios = require("axios");

function deliveryError(message, cause) {
    return Object.assign(new Error(message), {
        statusCode: 503,
        cause,
    });
}

async function sendVerificationEmail({ email, code }) {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email", {
                sender: {
                    name: process.env.MAIL_FROM_NAME || "HomeCare",
                    email: process.env.MAIL_FROM,
                },
                to: [{
                    email,
                }, ],
                subject: "HomeCare Email Verification",
                htmlContent: `
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
                textContent: `Your verification code is ${code}. It expires in 15 minutes.`,
            }, {
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                },
                timeout: 10000,
            }
        );

        console.log("Brevo Email Sent:", response.data);

        return true;
    } catch (error) {
        console.error("=========== BREVO ERROR ===========");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        throw deliveryError("Email delivery failed.", error);
    }
}

module.exports = {
    sendVerificationEmail,
};