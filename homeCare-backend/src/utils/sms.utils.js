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
  const allowMockOtp =
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_MOCK_OTP === "true";

  if (!fast2smsKey) {
    if (!allowMockOtp) {
      logger.warn("FAST2SMS_API_KEY is missing. OTP was generated but SMS was not sent.");
      return { sent: false, provider: "none", reason: "missing_api_key" };
    }

    logger.info(`SMS mock: OTP ${otp} for +91${number}`);
    return { sent: false, provider: "mock" };
  }

  const params = new URLSearchParams({
    route: "otp",
    variables_values: String(otp),
    numbers: number,
  });

  const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`, {
    method: "GET",
    headers: {
      authorization: fast2smsKey,
      accept: "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.return === false) {
    throw new Error(data.message || "Failed to send OTP SMS");
  }

  return { sent: true, provider: "fast2sms", data };
}

module.exports = { sendOtpSms };
