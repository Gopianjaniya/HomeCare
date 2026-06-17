# Speedu - Node.js + Express + MongoDB Backend

A production-ready Node.js backend project with **Express**, **MongoDB**, **Signal SMS OTP integration**, and environment-based configuration.  
Designed to be scalable, modular, and easy to maintain.

---

## Features

- Node.js + Express backend
- MongoDB connection with retry & proper logs
- Modular folder structure (Auth, User modules, etc.)
- Signal / SMS OTP integration
- JWT Authentication ready
- Environment-based configuration (`.env`)
- ESLint + Prettier ready for clean code
- Logging utility for server messages
- Local IP detection for LAN testing
- asdfg

---

## Folder Structure

speedu/
├── server.js # Main entry point
├── .env # Environment configuration
├── package.json
├── .gitignore
└── src/
├── app.js # Express app configuration
├── index.js # Master router combining all module routes
├── config/
│ └── db.config.js
├── modules/
│ ├── auth/
│ │ ├── auth.routes.js
│ │ ├── auth.controller.js
│ │ └── auth.service.js
│ └── user/
│ ├── user.routes.js
│ ├── user.controller.js
│ └── user.service.js
└── utils/
├── common.utils.js # Utility functions (like getLocalIP)
└── logger.js # Logger utility

---

## Prerequisites

- Node.js >= 18.x (Recommended: Use NVM)
- MongoDB cluster or local instance
- npm >= 9.x

---

## Project Repository

This project is open source and available on GitHub:

🔗 [Speedu Backend GitHub Repo](https://github.com/Nitinmalviy/speedu-backend)

### Clone the repository

```bash
git clone https://github.com/Nitinmalviy/speedu-backend.git
cd speedu
```

<!-- Testing for get ing branch -->

<!-- main  -->

<!-- login  -->
<!-- sing up -->
