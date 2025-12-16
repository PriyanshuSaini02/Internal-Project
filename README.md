# 🚀 Internal Project - Admin Dashboard & User Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> A comprehensive full-stack web application for admin authentication and user management, built with modern technologies and best practices.

## ✨ Features

### 🔐 **Authentication System**
- JWT-based admin authentication
- Secure password reset via email
- Session persistence with automatic logout
- Protected route access control

### 👥 **User Management**
- Complete CRUD operations for users
- Auto-generated user credentials (Format: `EM-XXXXXX`)
- Bulk user operations and search functionality
- User profile management with statistics

### 📧 **Email Integration**
- Automated welcome emails with credentials
- Password reset emails with secure tokens
- SMTP configuration with Gmail support
- Professional HTML email templates

### 🖼️ **File Management**
- Cloudinary integration for profile pictures
- Automatic image optimization and storage
- Secure file upload with validation
- Automatic cleanup of old files

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Modern admin dashboard interface
- Real-time loading states and feedback
- Professional styling with Lucide icons

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js 18+
MongoDB (local or Atlas)
Git
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/internal-project.git
cd internal-project
```

2. **Backend Setup**
```bash
cd backend
npm install

cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3000/api" > .env ""this can vary"
```

4. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:5173 ```this can vary```
- Backend API: http://localhost:3000/api   ```this can vary```
- First time: Register admin at `/register`

## ⚙️ Environment Configuration

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/internal-project ```this can vary```

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173   ```this can vary```

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api      ```this can vary```
```

## 📁 Project Structure

```
internal-project/
├── 📁 backend/                 # Express.js API Server
│   ├── 📁 controllers/         # Request handlers
│   │   ├── adminController.js  # Admin authentication
│   │   └── userController.js   # User management
│   ├── 📁 models/              # MongoDB schemas
│   │   ├── admin.js           # Admin model
│   │   └── user.js            # User model
│   ├── 📁 routes/              # API routes
│   │   ├── adminRoute.js      # Admin endpoints
│   │   └── userRoute.js       # User endpoints
│   ├── 📁 middleware/          # Custom middleware
│   │   ├── adminAuth.js       # JWT authentication
│   │   └── upload.js          # File upload handling
│   ├── 📁 utils/               # Utility functions
│   │   └── emailService.js    # Email utilities
│   ├── 📁 db/                  # Database configuration
│   │   └── db.js              # MongoDB connection
│   └── index.js               # Server entry point
│
├── 📁 frontend/                # React SPA
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── UserForm.jsx       # User forms
│   │   │   ├── UserDetails.jsx    # User profiles
│   │   │   └── 📁 ui/             # Reusable components
│   │   ├── 📁 context/         # React Context
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   ├── 📁 services/        # API services
│   │   │   └── api.js           # HTTP client
│   │   └── App.jsx            # Main application
│   └── 📁 public/             # Static assets
│
├── 📄 README.md               # This file
├── 📄 LICENSE                 # License file
└── 📄 .gitignore             # Git ignore rules
```

## 🔌 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/admin/register` | Create admin account | ❌ |
| `POST` | `/api/admin/login` | Admin login | ❌ |
| `POST` | `/api/admin/forgot-password` | Request password reset | ❌ |
| `POST` | `/api/admin/reset-password` | Reset password | ❌ |
| `GET` | `/api/admin/verify-reset-token/:token` | Validate reset token | ❌ |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users` | List all users | ✅ |
| `GET` | `/api/users/:id` | Get user details | ✅ |
| `POST` | `/api/users/add` | Create new user | ✅ |
| `PUT` | `/api/users/:id` | Update user | ✅ |
| `DELETE` | `/api/users/:id` | Delete user | ✅ |
| `POST` | `/api/users/:id/profile-picture` | Upload profile picture | ✅ |
| `GET` | `/api/users/:id/profile-picture` | Get profile picture | ✅ |

## 🔒 Security Features

- ✅ JWT token authentication with expiration
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Protected API routes with middleware
- ✅ Input validation and sanitization
- ✅ CORS configuration for cross-origin requests
- ✅ Secure file upload with Cloudinary
- ✅ Environment variable protection
- ✅ Automatic token refresh and logout

## 📊 Performance

- ⚡ **Frontend**: Vite for fast development and optimized builds
- ⚡ **Backend**: Express.js with efficient middleware
- ⚡ **Database**: MongoDB with indexed queries
- ⚡ **Images**: Cloudinary CDN for fast image delivery
- ⚡ **Caching**: Browser caching and API response optimization

## 🐛 Troubleshooting

<details>
<summary><strong>Common Issues & Solutions</strong></summary>

### Backend Issues
**MongoDB Connection Failed**
```bash
# Check MongoDB service
# Or use MongoDB Atlas connection string


### Frontend Issues
**API Connection Failed**
```bash
# Verify backend is running
curl http://localhost:5000/api/admin/login
# Check VITE_API_URL in .env
```

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Email Issues
**Gmail Authentication**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in EMAIL_PASSWORD

</details>