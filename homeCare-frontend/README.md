# HomeCare Frontend

Vite React frontend for the HomeCare customer and agent service booking app.

## Setup

```bash
npm install
npm run dev
```

PowerShell execution policy agar `npm` ko block kare, to Windows par ye command use karo:

```bash
npm.cmd run dev
```

Open:

```txt
http://localhost:5173
```

## Backend URL

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For deploy:

```env
VITE_API_BASE_URL=https://homecare-1-ftut.onrender.com/api
```

## Deploy (Render / static host)

| Setting | Value |
|--------|--------|
| Root Directory | `homeCare-frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Node | 20+ |

**Environment variable (build time - zaroori):**

```env
VITE_API_BASE_URL=https://homecare-1-ftut.onrender.com/api
```

Bina `VITE_API_BASE_URL` ke bhi default backend URL code me set hai; production par env variable set karna behtar hai.

Redeploy ke baad: home page, login OTP, admin login, booking flow ek baar check kar lena.
