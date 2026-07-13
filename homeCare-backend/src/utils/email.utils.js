const nodemailer = require("nodemailer");

function emailMessage({ email, code }) {
  return {
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
}

function deliveryError(message, cause) {
  return Object.assign(new Error(message), { statusCode: 503, cause });
}

async function sendWithResend(message) {
  if (!process.env.RESEND_API_KEY) return false;
  if (!process.env.MAIL_FROM) {
    throw deliveryError("Email delivery is not configured. Set MAIL_FROM for the Resend sender.");
  }

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw deliveryError("Email provider could not be reached. Please try again.", error);
  }

  if (!response.ok) {
    const details = await response.text();
    throw deliveryError(`Email provider rejected the request (${response.status}). ${details}`);
  }

  return true;
}

function getSmtpTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw deliveryError("Email delivery is not configured. Set RESEND_API_KEY or SMTP settings.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

async function sendVerificationEmail({ email, code }) {
  const message = emailMessage({ email, code });
  if (await sendWithResend(message)) return;

  const transport = getSmtpTransport();
  try {
    await transport.sendMail(message);
  } catch (error) {
    throw deliveryError("Email delivery failed. Please try again.", error);
  } finally {
    transport.close();
  }
}

module.exports = { sendVerificationEmail };
