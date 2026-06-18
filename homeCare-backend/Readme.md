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
```

Local MongoDB chal raha ho to backend startup par ye log aayega:

```txt
[DATABASE] Connected Successfully {"database":"HomeCare"}
```

## Deploy Notes

Render/backend deploy par Node 20+ use karo. OTP ke liye recommended setup:

```env
NODE_ENV=production
FAST2SMS_API_KEY=your-fast2sms-key
ALLOW_MOCK_OTP=false
FRONTEND_URL=https://your-frontend-domain.onrender.com
```

Demo/testing deployment me agar SMS provider nahi lagana hai, tab:

```env
ALLOW_MOCK_OTP=true
```

Is mode me OTP API response me aayega, jise frontend hint ki tarah dikha sakta hai.
