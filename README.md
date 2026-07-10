# Secure Gate RBAC Backend & Next.js Admin Dashboard

A robust and secure User Role-Based Access Control (RBAC) system with OTP authentication, built with a Node.js Express REST API backend and a premium React/Next.js dashboard frontend.

---

## 🌟 Features

- **Double-Stage OTP Authentication**: Password-less verification cycle with mobile validation, attempt limiting, and expiration checks.
- **JWT Authorization System**: Secure Bearer tokens containing payload credentials for authorization checks.
- **Role-Based Access Control (RBAC)**: Custom permissions checks matching roles: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, and `USER`.
- **System Activity & Audit Logs**: Detailed logs recorded for actions like OTP generations, logins, role patches, access rejections, and user creations.
- **Audit Logs API**: Paginated log queries filtering by action types, SUCCESS/FAILED status, and text-based searches.
- **Centralized Error Handling**: Integrated Express error interceptor transforming validation, DB, and permissions errors into uniform JSON structures.
- **Next.js Admin Dashboard**: A premium, responsive, dark-themed dashboard using React, Next.js (App Router), Tailwind CSS, and Lucide Icons. Features card grids, user tables, search-filtering panels, and overlay forms.

---

## 📁 Project Structure

```text
rbac-otp-backend/
├── dashboard/                    # React / Next.js Frontend Application (NEW)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/        # Authenticated dashboard views
│   │   │   │   ├── logs/         # System Audit Logs view
│   │   │   │   ├── profile/      # User profile details view
│   │   │   │   ├── users/        # User database & modal operations view
│   │   │   │   └── page.jsx      # Overview cards screen
│   │   │   ├── login/
│   │   │   │   └── page.jsx      # OTP verification & Login form
│   │   │   ├── globals.css       # Tailwind & custom CSS variables
│   │   │   ├── layout.js         # Root layout configuration
│   │   │   └── page.js           # Index redirect to /dashboard
│   │   ├── components/           # Reusable React UI elements
│   │   │   ├── Layout.jsx        # Auth guard layout wrapper
│   │   │   ├── Navbar.jsx        # Dashboard topbar
│   │   │   └── Sidebar.jsx       # Collapsible navigation menu
│   │   └── utils/
│   │       └── api.js            # API fetch orchestrator with JWT injector
│   ├── tailwind.config.js        # Tailwind configuration
│   └── package.json              # Frontend npm dependencies
├── src/                          # Express.js REST API Backend Application
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── constants/
│   │   ├── actions.js            # Audit action enum keys
│   │   └── roles.js              # RBAC role levels
│   ├── controllers/
│   │   ├── auth.controller.js    # Login & OTP controller
│   │   ├── log.controller.js     # System logs controller
│   │   └── user.controller.js    # User management controller
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification guard
│   │   ├── error.middleware.js   # Centralized error handler
│   │   ├── role.middleware.js    # RBAC authorization filter
│   │   └── validate.middleware.js# express-validator response wrapper
│   ├── models/
│   │   ├── Log.js                # Logs collection schema
│   │   ├── OTP.js                # OTP transactions schema
│   │   └── User.js               # Users database schema
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoint routers
│   │   ├── log.routes.js         # Logs endpoint routers
│   │   └── user.routes.js        # Users endpoint routers
│   ├── scripts/
│   │   └── seedUsers.js          # DB seeder helper
│   ├── utils/
│   │   ├── AppError.js           # Operational error class
│   │   ├── generateOTP.js        # OTP generator logic
│   │   └── jwt.js                # JWT token signing wrapper
│   └── app.js                    # Express app router & CORS configuration
├── thunder-tests/
│   └── thunder-collection_rbac_otp_backend.json # Thunder Client Collection API
├── README.md                     # Project documentation
├── Thunder_Client_Collection.json# API collection copy
├── package.json                  # Root package configurations (concurrent run scripts)
└── server.js                     # Main server entrypoint
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root folder (same directory as `server.js`):

```ini
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/your-db-name
JWT_SECRET=your_super_secret_jwt_signing_key_phrase
JWT_EXPIRES_IN=1d
```

---

## 🚀 Installation & How to Run

### 1. Install all dependencies
Run this command from the root directory to install packages in both the backend and frontend:
```bash
npm install && npm --prefix dashboard install
```

### 2. Seed Database Users
Populate the database with the pre-configured role accounts:
```bash
node src/scripts/seedUsers.js
```
*Seeded user credentials for testing:*
- **Super Admin**: `9999999991`
- **Admin**: `9999999992`
- **Manager**: `9999999993`
- **Regular User**: `9999999994`

### 3. Run in Development Mode
Starts both the Express API (port 8000) and Next.js frontend (port 3000) concurrently:
```bash
npm run dev
```

### 4. Build and Run in Production Mode
```bash
# Build the Next.js production files
npm run build:dashboard

# Start both servers in production mode
npm run start:all
```
You can access the admin dashboard in your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 📋 API Documentation

### Authentication (`/auth`)
* `POST /auth/send-otp` - Generate and send OTP to mobile. (Public)
  * Body: `{"mobile": "9999999991"}`
* `POST /auth/verify-otp` - Validate OTP and return JWT token. (Public)
  * Body: `{"mobile": "9999999991", "otp": "123456"}`

### Users Management (`/users`)
* `GET /users/profile` - Get logged-in user details. (Authenticated)
* `GET /users` - List all users. (Super Admin, Admin, Manager)
* `POST /users` - Create user. (Super Admin, Admin)
  * Body: `{"name": "Alice", "mobile": "9999999995", "role": "USER"}`
* `PATCH /users/:id/role` - Update role. (Super Admin only)
  * Body: `{"role": "MANAGER"}`
* `DELETE /users/:id` - Delete user. (Super Admin only)

### System Audit Logs (`/logs`)
* `GET /logs` - Paginated system logs. (Super Admin, Admin only)
  * Query: `?page=1&limit=10&search=999&action=LOGIN_SUCCESS&status=SUCCESS`
* `GET /logs/login` - Paginated login logs. (Super Admin, Admin only)
  * Query: `?page=1&limit=10&status=SUCCESS`
* `GET /logs/stats` - Statistics for dashboard activity counts. (Super Admin, Admin only)

---

## ⚡ Unified API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logs retrieved successfully",
  "data": {
    "totalUsers": 4,
    "totalLogs": 46
  }
}
```

### Operational Error Response
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access Denied",
  "errors": null
}
```

---

## 🧪 Testing Checklist

### 1. Backend API Routing Check
- [x] Run seed script -> verify console logs "Users Seeded Successfully".
- [x] POST `/auth/send-otp` -> verify response returns status `200` and `otp` field.
- [x] POST `/auth/verify-otp` with valid OTP -> verify token string returned in response.
- [x] GET `/users/profile` with Bearer token -> verify user profile details are fetched.
- [x] GET `/logs` using Super Admin token -> verify paginated logs returned.
- [x] GET `/logs` using Manager token -> verify response status `403` Access Denied.
- [x] GET `/api/not-found` -> verify response status `404` Route Not Found.

### 2. React / Next.js Dashboard Check
- [x] Visit [http://localhost:3000](http://localhost:3000) without token -> redirected immediately to `/login`.
- [x] Login page mobile submission -> generates and displays code, switching form state.
- [x] Valid OTP entry -> redirects to `/dashboard`, cards count load values.
- [x] Users page role controls:
  - Logged in as `SUPER_ADMIN` -> Create, Update role, and Delete action buttons are visible and functional.
  - Logged in as `ADMIN` -> Create button is visible, but Update role and Delete actions are hidden.
  - Logged in as `MANAGER` -> Create, Update role, and Delete buttons are hidden.
- [x] Logs page pagination & search -> inputs successfully reload results, Next/Prev buttons update grid.
- [x] Profile page details -> matches logged in user, logout button clears cache and redirects to login.

---

## 📸 Sample Screenshots to Capture

Before submission, capture the following screenshots:
1. **Login Screen**: Mobile input state and OTP verification state.
2. **Dashboard Cards**: Stats cards display (Total Users, Total Logs, Today's Logins, Today's OTPs).
3. **Users Management (Super Admin View)**: Table displaying Action buttons (Edit Role, Delete User) and Create User button.
4. **Users Management (Manager View)**: Table where Create, Edit Role, and Delete actions are hidden.
5. **Create User Modal**: Modal view overlaying the background grid.
6. **Logs Audit Grid**: Paginated logs list demonstrating Search and filtering dropdown menus.
7. **Access Denied Alert**: 403 error page/redirect when accessing restricted routes.
8. **Profile View**: Account profile details display.

---

## 📥 Final Submission Checklist

- [ ] `.env` parameters are verified.
- [ ] Database seeded using `node src/scripts/seedUsers.js`.
- [ ] Express server starts without warnings via `npm run dev`.
- [ ] React/Next.js frontend loads dev files successfully on port 3000.
- [ ] Unified API response format is followed on all routes.
- [ ] Thunder Client collection loaded into root as `Thunder_Client_Collection.json`.
- [ ] Capture the 8 screenshots listed above.
- [ ] Zip project folder excluding `node_modules` and `dashboard/.next` for final upload.
# RBAC-Assignment-Backend
