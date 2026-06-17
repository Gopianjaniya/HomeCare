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

`.env` file me ye MongoDB settings honi chahiye:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/
DB_NAME=HomeCare
```

Local MongoDB chal raha ho to backend startup par ye log aayega:

```txt
[DATABASE] Connected Successfully {"database":"HomeCare"}
```
