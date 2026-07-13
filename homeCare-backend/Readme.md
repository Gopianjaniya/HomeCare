# HomeCare Backend

Node.js + Express + MongoDB backend for the HomeCare service booking app.

## Setup

```bash
npm install
npm run start
```

PowerShell execution policy agar `npm` ko block kare, to Windows par ye command use karo:

```bash
npm.cmd run start
```

Server default:

```txt
http://localhost:8000
```

## Environment

`.env` file me ye settings honi chahiye:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/
DB_NAME=HomeCare
JWT_SECRET_KEY=change-this-access-secret
JWT_REFRESH_SECRET_KEY=change-this-refresh-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_SECURE=false
MAIL_FROM="HomeCare <your-email@gmail.com>"
```

Local MongoDB chal raha ho to backend startup par ye log aayega:

```txt
[DATABASE] Connected Successfully {"database":"HomeCare"}
```

## Deploy Notes

Render free web services cannot connect to SMTP ports 25, 465, or 587. For a free Render deployment, use the Resend HTTPS API instead of Gmail SMTP:

```env
NODE_ENV=production
RESEND_API_KEY=re_your_resend_api_key
MAIL_FROM="HomeCare <verified-sender@your-domain.com>"
FRONTEND_URL=https://your-frontend-domain.onrender.com
```

Add `RESEND_API_KEY` and `MAIL_FROM` to the Render service's Environment settings, and verify the sender domain in Resend. SMTP remains supported for local development or a paid Render instance. OTP API response me return nahi hota; woh sirf entered email address par bheja jata hai.
