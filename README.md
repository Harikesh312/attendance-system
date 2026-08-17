# MERN Stack QR Code Attendance System

A full-stack web application for tracking student attendance using QR codes. The admin generates a session QR code, and students scan it to mark their attendance.

## Features
- **Admin Portal**: Generate QR codes with session expiry, view attendance records in real-time, and download records as CSV.
- **Student Portal**: Register, login, scan QR codes using a device camera, and view personal attendance history.
- **Security**: JWT-based authentication, bcrypt password hashing, input validation, and rate limiting.

## Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Axios, html5-qrcode
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: jsonwebtoken (JWT), bcryptjs

## Setup Instructions

### 1. Clone and install
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
```
Edit `.env` with your MongoDB URI and a real JWT secret. By default, it uses `mongodb://localhost:27017/qr_attendance`.

### 3. Run MongoDB locally
Ensure you have MongoDB running locally, or use a MongoDB Atlas connection string in the `.env` file.

### 4. Start backend
From the `/server` directory:
```bash
npm run dev
```
*Note: On the first run, a default admin account is created based on the `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file.*

### 5. Start frontend
From the `/client` directory in a new terminal:
```bash
npm run dev
```

The app will run at `http://localhost:5173`, and the API runs at `http://localhost:5000`.

## Testing the QR Scanner
If you want to test the QR scanner using your mobile device's camera:
1. Ensure your computer and mobile device are on the same Wi-Fi network.
2. When you run `npm run dev` in the client directory, Vite will display a `Network` URL (e.g., `http://192.168.1.5:5173`).
3. Open that Network URL on your mobile browser, login as a student, and scan the code generated on your computer screen.
