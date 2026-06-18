const logger = require("./logger");

function cleanIndianMobile(mobile = "") {
  return String(mobile || "").replace(/^\+91/, "").replace(/^91/, "").replace(/\D/g, "");
}

async function sendOtpSms(mobile, otp) {
  const number = cleanIndianMobile(mobile);

  if (!/^[6-9]\d{9}$/.test(number)) {
    throw new Error("Invalid mobile number for SMS");
  }

  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  if (!fast2smsKey) {
    logger.warn("FAST2SMS_API_KEY is missing. OTP was generated but SMS was not sent.");
    return { sent: false, provider: "none", reason: "missing_api_key" };
  }

  const params = new URLSearchParams({
    route: "otp",
    variables_values: String(otp),
    numbers: number,
  });

  try {
    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`, {
      method: "GET",
      headers: {
        authorization: fast2smsKey,
        accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.return === false) {
      logger.warn(`Fast2SMS failed: ${data.message || response.statusText}`);
      return { sent: false, provider: "fast2sms", reason: data.message || "failed" };
    }

    return { sent: true, provider: "fast2sms", data };
  } catch (error) {
    logger.warn(`Fast2SMS request failed: ${error.message}`);
    return { sent: false, provider: "fast2sms", reason: "request_failed" };
  }
}

module.exports = { sendOtpSms };
