# ORUFY TECHNOLOGIES – MERN Assignment

A full-stack **Product Management System** built using the **MERN Stack**.  
The application includes authentication using OTP + JWT, protected routes, product CRUD operations, image uploads, and publish/unpublish functionality.

---

## 🧱 Project Structure

ORUFY_TECHNOLOGIES_ASSIGNMENT/
│
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ │ ├── images/
│ │ │ └── Logo/
│ │ │
│ │ ├── Auth/
│ │ │ ├── Login.jsx
│ │ │ └── Login.css
│ │ │
│ │ ├── Components/
│ │ │ ├── Header.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── MainLayout.jsx
│ │ │ └── Sidebar.jsx
│ │ │
│ │ ├── CustomHooks/
│ │ │ └── useDebounce.jsx
│ │ │
│ │ ├── Products/
│ │ │ ├── ManageProducts.jsx
│ │ │ ├── Published.jsx
│ │ │ ├── Unpublished.jsx
│ │ │ └── *.css
│ │ │
│ │ ├── ProtectRouter/
│ │ │ └── Protector.jsx
│ │ │
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ ├── package.json
│ └── .env
│
├── backend/
│ ├── Controllers/
│ │ ├── userController.js
│ │ ├── productController.js
│ │ └── imageController.js
│ │
│ ├── Middleware/
│ │ └── auth.js
│ │
│ ├── Models/
│ │ ├── userModel.js
│ │ ├── productModel.js
│ │ └── productImgModel.js
│ │
│ ├── Routers/
│ │ ├── userRoute.js
│ │ └── productRouter.js
│ │
│ ├── cloudinary.js
│ ├── nodemailer.js
│ ├── server.js
│ ├── package.json
│ └── .env
│
└── README.md

---

## 🚀 Tech Stack

### Frontend
- React
- React Router DOM
- Axios
- React Toastify
- CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (OTP)
- Cloudinary (Image Upload)

---

## 🔧 Setup Instructions

---

## 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
Frontend runs on:
http://localhost:5173


cd backend
npm install
npm start
backend run on:
http://localhost:8080

create .env file and add

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

PORT=8080
# MONGO_URI=your_mongodb_connection_string
MONGO_URI=Atlas url if not working on mongoDB compass

# nodemailer
pass=nodemailer pass from google google account generate and use
# clloudinary
cloud_name=your_cloudinary_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_secret
JWT_SECRET=your_jwt_secret

✨ Features

OTP based login
JWT authentication
Product CRUD
Image upload (Cloudinary)
Publish / Unpublish product
Protected routes
Logout handling
Responsive UI

📌Notes
Unauthorized users are redirected to /login
Logged-in users cannot access /login
Token stored as authToken in localStorage


