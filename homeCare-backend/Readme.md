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

Render/backend deploy par Node 20+ use karo. Email OTP ke liye SMTP configure karo:

```env
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_SECURE=false
MAIL_FROM="HomeCare <your-email@gmail.com>"
FRONTEND_URL=https://your-frontend-domain.onrender.com
```

Gmail use kar rahe ho to normal account password ke bajay Google App Password use karo. OTP API response me return nahi hota; woh sirf entered email address par bheja jata hai.
