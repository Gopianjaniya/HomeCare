const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const router = require("./router");
const app = express();

//   FIX: Use only express built-in JSON & urlencoded parsers (no body-parser needed)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
    cors({
        origin: "*" || process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

app.use(compression());

//   FIX: morgan properly used for HTTP request logging (dev mode only)
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Static pages
app.get("/test", (req, res) => {
    res.json({ message: "new deployment working" });
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HomeCare backend is running",
    });
});

app.get("/qr-redirect", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/qr-redirect.html"));
});

app.get("/terms&condition", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/terms&condition.html"));
});

app.get("/privacypolicies", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/privacypolicies.html"));
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", router);

module.exports = app;