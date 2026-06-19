const isDevelopment = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

function formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

const logger = {
    info: (message, meta = {}) => {
        if (isDevelopment && !isTest) {
            console.log(formatMessage("INFO", message, meta));
        }
    },

    error: (message, error = null) => {
        if (!isTest) {
            const meta = error ? {
                error: error.message,
                stack: isDevelopment ? error.stack : undefined,
            } : {};
            console.error(formatMessage("ERROR", message, meta));
        }
    },

    warn: (message, meta = {}) => {
        if (isDevelopment && !isTest) {
            console.warn(formatMessage("WARN", message, meta));
        }
    },

    debug: (message, meta = {}) => {
        if (isDevelopment && !isTest && process.env.DEBUG === "true") {
            console.log(formatMessage("DEBUG", message, meta));
        }
    },

    success: (message, meta = {}) => {
        if (isDevelopment && !isTest) {
            console.log(formatMessage("SUCCESS", `  ${message}`, meta));
        }
    },

    query: (operation, collection, duration = null) => {
        if (isDevelopment && !isTest && process.env.LOG_QUERIES === "true") {
            const meta = { collection };
            if (duration) meta.duration = `${duration}ms`;
            console.log(formatMessage("QUERY", operation, meta));
        }
    },

    http: (method, url, statusCode, duration = null) => {
        if (isDevelopment && !isTest) {
            const meta = { method, url, statusCode };
            if (duration) meta.duration = `${duration}ms`;
            console.log(formatMessage("HTTP", `${method} ${url} ${statusCode}`, meta));
        }
    },
};

logger.productionError = (message, error = null) => {
    const meta = error ? { error: error.message } : {};
    console.error(formatMessage("ERROR", message, meta));
};

module.exports = logger;