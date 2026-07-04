const logger = require("./logger");

function cleanIndianMobile(mobile = "") {
    return String(mobile || "").replace(/^\+91/, "").replace(/^91/, "").replace(/\D/g, "");
}

function toIndianE164(mobile = "") {
    const number = cleanIndianMobile(mobile);
    assertValidMobile(number);
    return `+91${number}`;
}

function getTwilioConfig() {
    return {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
        baseUrl: process.env.TWILIO_VERIFY_BASE_URL || "https://verify.twilio.com",
    };
}

function isSmsProviderConfigured() {
    const { accountSid, authToken, verifyServiceSid } = getTwilioConfig();
    return Boolean(accountSid && authToken && verifyServiceSid);
}

function assertValidMobile(number) {
    if (!/^[6-9]\d{9}$/.test(number)) {
        throw new Error("Invalid mobile number for SMS");
    }
}

function assertTwilioConfigured() {
    const config = getTwilioConfig();
    if (!config.accountSid) {
        throw new Error("TWILIO_ACCOUNT_SID missing in .env");
    }
    if (!config.authToken) {
        throw new Error("TWILIO_AUTH_TOKEN missing in .env");
    }
    if (!config.verifyServiceSid) {
        throw new Error("TWILIO_VERIFY_SERVICE_SID missing in .env");
    }
    return config;
}

function getTwilioAuthHeader(config) {
    return `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`;
}

function providerError(message, statusCode = 502) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function parseProviderResponse(response) {
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : {};
    } catch {
        return { message: text };
    }
}

async function callTwilioVerify(path, body) {
    const config = assertTwilioConfigured();
    let response;
    try {
        response = await fetch(`${config.baseUrl}${path}`, {
            method: "POST",
            headers: {
                authorization: getTwilioAuthHeader(config),
                "content-type": "application/x-www-form-urlencoded",
                accept: "application/json",
            },
            body: new URLSearchParams(body),
        });
    } catch {
        throw providerError("Could not reach Twilio Verify. Please check internet/network access and try again.");
    }
    const data = await parseProviderResponse(response);

    if (!response.ok) {
        throw providerError(data.message || "Twilio Verify request failed", response.status);
    }

    return data;
}

async function sendTwilioVerification(mobile) {
    const config = assertTwilioConfigured();
    const to = toIndianE164(mobile);
    const data = await callTwilioVerify(`/v2/Services/${config.verifyServiceSid}/Verifications`, {
        To: to,
        Channel: "sms",
    });

    return { sent: true, provider: "twilio-verify", data };
}

async function verifyTwilioOtp(mobile, otp) {
    const config = assertTwilioConfigured();
    const to = toIndianE164(mobile);
    const data = await callTwilioVerify(`/v2/Services/${config.verifyServiceSid}/VerificationCheck`, {
        To: to,
        Code: String(otp),
    });

    if (data.status !== "approved") {
        throw new Error("Invalid OTP. Please check and try again.");
    }

    return { verified: true, provider: "twilio-verify", data };
}

async function sendOtpSms(mobile, otp) {
    const number = cleanIndianMobile(mobile);
    assertValidMobile(number);

    if (isSmsProviderConfigured()) {
        return sendTwilioVerification(mobile);
    }

    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (!fast2smsKey) {
        if (process.env.NODE_ENV !== "production") {
            logger.info(`SMS mock: OTP ${otp} for +91${number}`);
        }
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

async function resendOtpSms(mobile, otp) {
    return sendOtpSms(mobile, otp);
}

module.exports = { sendOtpSms, resendOtpSms, verifyTwilioOtp, isSmsProviderConfigured };
