# 🚀 StreamVerse

> 🎮 **StreamVerse** — A modern video streaming backend built with **Node.js**, **Express** and **MongoDB**.
> Simple, modular and production-ready — deployable on Render.

---

## 🔥 Live Demo (Backend)

**🌐 Render URL:** [Click Me](https://streamverse-xd5s.onrender.com)

---

## 🧭 Project Summary

StreamVerse is a backend for a YouTube-like video streaming platform.
It provides complete functionality for handling users, authentication, and media upload with **Cloudinary**.

### 🎯 Key Highlights

* 🔐 Secure user authentication (JWT + bcrypt)
* ☁️ Cloudinary integration for video & image uploads
* 🧱 Modular MVC architecture for clean code
* 💿 MongoDB (Mongoose) for scalable data storage
* 🛡️ Centralized error handling & async wrapper
* 🌐 CORS-enabled for frontend (React/Vercel) integration

---

## 🛠️ Tech Stack

| Category           | Technology                |
| ------------------ | ------------------------- |
| **Runtime**        | Node.js                   |
| **Framework**      | Express.js                |
| **Database**       | MongoDB (Mongoose)        |
| **Cloud Storage**  | Cloudinary                |
| **Authentication** | JWT + bcrypt              |
| **Dev Tools**      | Nodemon, Dotenv, Prettier |
| **Deployment**     | Render                    |

---

## 📂 Folder Structure

```
Project-Folder/
│
├── src/
│   ├── controllers/        # All controller logic (register, login, upload, etc.)
│   ├── db/                 # MongoDB connection setup
│   ├── middlewares/        # Auth, asyncHandler, multer, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # All API routes (users, videos, etc.)
│   ├── utils/              # Helper functions (Cloudinary upload, etc.)
│   ├── app.js              # Express app setup & middleware config
│   └── index.js            # Main entry (connect DB & start server)
│
├── public/                 # Temporary upload folder for multer
├── .env                    # Environment variables (not pushed)
├── package.json            # Project dependencies & scripts
└── README.md               # Project documentation
```

---

## ⚙️ Installation & Setup (Local Machine)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mannsk1302/StreamVerse.git
cd StreamVerse/Project-Folder
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4️⃣ Run the Server

```bash
npm run dev   # For development
npm start     # For production
```

Server runs on: **[http://localhost:8000](http://localhost:8000)**

---

## 🔌 Environment Variables (Required)

| Variable                | Description                     |
| ----------------------- | ------------------------------- |
| `PORT`                  | Port number where app runs      |
| `MONGODB_URI`           | MongoDB Atlas connection string |
| `CORS_ORIGIN`           | Allowed frontend origin         |
| `ACCESS_TOKEN_SECRET`   | Secret for JWT access tokens    |
| `ACCESS_TOKEN_EXPIRY`   | Expiry for access token         |
| `REFRESH_TOKEN_SECRET`  | Secret for refresh token        |
| `REFRESH_TOKEN_EXPIRY`  | Expiry for refresh token        |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name           |
| `CLOUDINARY_API_KEY`    | Cloudinary API key              |
| `CLOUDINARY_API_SECRET` | Cloudinary secret key           |

---

## ☁️ Deployment on Render

1. Push code to GitHub
2. Go to [Render.com](https://render.com) → **New → Web Service**
3. Connect repo and setup:

   * Root Directory → `Project-Folder`
   * Build Command → `npm install`
   * Start Command → `npm start`
4. Add environment variables in *Settings → Environment*
5. Click **Deploy**

---

## 📦 Example API Routes

> Base URL: `https://streamverse-xd5s.onrender.com/api/v1`

### User Routes

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| POST   | `/users/register` | Register new user                |
| POST   | `/users/login`    | Login user                       |
| GET    | `/users/profile`  | Get user profile (auth required) |

### Video Routes

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/videos/upload` | Upload video to Cloudinary |
| GET    | `/videos`        | Get all videos             |
| GET    | `/videos/:id`    | Get single video           |
| DELETE | `/videos/:id`    | Delete video               |

---

## 🤮 API Testing via Postman

**Example:** Register User

```bash
POST /api/v1/users/register
Content-Type: application/json
```

**Body:**

```json
{
  "username": "mann",
  "email": "mann@gmail.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully!",
  "user": {
    "_id": "abc123",
    "username": "mann",
    "email": "mann@gmail.com"
  }
}
```

---

## 💡 CORS Setup (Frontend Integration)

**In app.js:**

```js
import cors from "cors";

app.use(cors({
  origin: ["https://your-frontend.vercel.app", "http://localhost:5173"],
  credentials: true
}));
```

**In Frontend (React):**

```js
axios.post("https://streamverse-xd5s.onrender.com/api/v1/users/register", data, {
  withCredentials: true
});
```

---

## 🌟 Features

* JWT Auth System
* Cloudinary Uploads
* MVC Architecture
* MongoDB + Mongoose
* Error Handling Middleware
* Render Deployment Ready
* CORS Integrated
* Secure Password Encryption

---

## 🔖 License

This project is open source under the **ISC License**.

---

## 👨‍💻 Author

**Mann Gwal**
GitHub: [@mannsk1302](https://github.com/mannsk1302)

> If you like this project, give it a ⭐ on GitHub and show your support!
