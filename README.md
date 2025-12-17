# 🚀 Internal Project - Admin Dashboard & User Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> A comprehensive full-stack web application for admin authentication and user management, built with modern technologies and best practices.

## ✨ Features

### 🔐 **Authentication System**
- **Cookie-based JWT authentication** (httpOnly cookies for enhanced security)
- Secure password reset via email
- Session persistence with automatic logout
- Protected route access control
- CSRF protection with SameSite cookies

### 👥 **User Management**
- Complete CRUD operations for users
- Auto-generated user credentials (Format: `EM-XXXXXX`)
- Bulk user operations and search functionality
- User profile management with statistics
- Soft delete with restore functionality

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
- **JWT** - Authentication tokens (httpOnly cookies)
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware
- **Cloudinary** - Image storage
- **Nodemailer** - Email service

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client (with credentials support)
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

# Copy and configure environment variables
cp example.env .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- First time: Register admin at `/register`

## ⚙️ Environment Configuration

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/internal-project

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
internal-project/
├── 📁 backend/                 # Express.js API Server
│   ├── 📁 controllers/         # Request handlers
│   │   ├── adminController.js  # Admin authentication (cookie-based)
│   │   └── userController.js   # User management
│   ├── 📁 models/              # MongoDB schemas
│   │   ├── admin.js           # Admin model
│   │   └── user.js            # User model
│   ├── 📁 routes/              # API routes
│   │   ├── adminRoute.js      # Admin endpoints
│   │   └── userRoute.js       # User endpoints
│   ├── 📁 middleware/          # Custom middleware
│   │   ├── adminAuth.js       # JWT cookie authentication
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
│   │   │   ├── Dashboard/         # Dashboard components
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── Register.jsx       # Admin registration
│   │   │   ├── UserForm.jsx       # User forms
│   │   │   ├── UserDetails.jsx    # User profiles
│   │   │   └── 📁 ui/             # Reusable components
│   │   ├── 📁 context/         # React Context
│   │   │   └── AuthContext.jsx   # Authentication state (cookie-based)
│   │   ├── 📁 services/        # API services
│   │   │   └── api.js           # HTTP client (withCredentials)
│   │   └── App.jsx            # Main application
│   └── 📁 public/             # Static assets
│
├── 📄 README.md               # This file
└── 📄 .gitignore             # Git ignore rules
```

## 🔌 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/admin/register` | Create admin account | ❌ |
| `POST` | `/api/admin/login` | Admin login (sets cookie) | ❌ |
| `POST` | `/api/admin/logout` | Admin logout (clears cookie) | ✅ |
| `GET` | `/api/admin/me` | Get current admin info | ✅ |
| `POST` | `/api/admin/forgot-password` | Request password reset | ❌ |
| `POST` | `/api/admin/reset-password` | Reset password | ❌ |
| `GET` | `/api/admin/verify-reset-token/:token` | Validate reset token | ❌ |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users` | List all users | ✅ |
| `GET` | `/api/users/deleted` | List deleted users | ✅ |
| `GET` | `/api/users/search` | Search users | ✅ |
| `GET` | `/api/users/:id` | Get user details | ✅ |
| `POST` | `/api/users/add` | Create new user | ✅ |
| `PUT` | `/api/users/:id` | Update user | ✅ |
| `DELETE` | `/api/users/:id` | Soft delete user | ✅ |
| `POST` | `/api/users/:id/restore` | Restore deleted user | ✅ |
| `POST` | `/api/users/:id/profile-picture` | Upload profile picture | ✅ |
| `GET` | `/api/users/:id/profile-picture` | Get profile picture | ✅ |

## 🔒 Security Features

- ✅ **Cookie-based JWT authentication** with httpOnly flag
- ✅ **SameSite cookie protection** against CSRF attacks
- ✅ **Secure cookie configuration** (secure flag in production)
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Protected API routes with cookie-based middleware
- ✅ Input validation and sanitization
- ✅ CORS configuration with credentials support
- ✅ Secure file upload with Cloudinary
- ✅ Environment variable protection
- ✅ Automatic token expiration and cleanup

## 📊 Performance

- ⚡ **Frontend**: Vite for fast development and optimized builds
- ⚡ **Backend**: Express.js with efficient middleware
- ⚡ **Database**: MongoDB with indexed queries
- ⚡ **Images**: Cloudinary CDN for fast image delivery
- ⚡ **Caching**: Browser caching and API response optimization
- ⚡ **Cookie Storage**: Reduced client-side storage overhead

## 🔄 Authentication Flow

### Login Flow
1. User submits credentials to `/api/admin/login`
2. Backend validates credentials and generates JWT
3. JWT stored in httpOnly cookie (not accessible via JavaScript)
4. Cookie automatically sent with subsequent requests
5. Frontend calls `/api/admin/me` to get user info

### Logout Flow
1. User clicks logout
2. Frontend calls `/api/admin/logout`
3. Backend clears the authentication cookie
4. Frontend clears local user state

### Session Persistence
1. On page load, frontend calls `/api/admin/me`
2. If cookie is valid, user info is returned
3. If cookie is invalid/expired, user is redirected to login

## 🐛 Troubleshooting

<details>
<summary><strong>Common Issues & Solutions</strong></summary>

### Backend Issues
**MongoDB Connection Failed**
```bash
# Check MongoDB service status
# Or use MongoDB Atlas connection string in .env
```

**Cookie Not Being Set**
```bash
# Ensure FRONTEND_URL matches your frontend domain
# Check CORS configuration includes credentials: true
# Verify cookie-parser middleware is installed and used
```

### Frontend Issues
**API Connection Failed**
```bash
# Verify backend is running
curl http://localhost:5000/api/admin/me
# Check VITE_API_URL in .env
```

**Authentication Not Working**
```bash
# Ensure withCredentials: true in axios config
# Check browser allows third-party cookies (if different domains)
# Verify CORS allows credentials from frontend origin
```

### Email Issues
**Gmail Authentication**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in EMAIL_PASSWORD

### Cookie Issues in Production
**Cookies Not Working Cross-Domain**
- Set `sameSite: 'none'` and `secure: true` for cross-domain
- Ensure both frontend and backend use HTTPS
- Configure CORS to allow specific origin (not wildcard with credentials)

</details>

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use secure cookie settings (secure: true, sameSite: 'strict')
3. Configure FRONTEND_URL to production domain
4. Use strong JWT_SECRET
5. Enable HTTPS

### Frontend
1. Set production `VITE_API_URL`
2. Build: `npm run build`
3. Serve `dist` folder with web server
4. Ensure backend CORS allows your domain

## 📝 Migration from localStorage to Cookies

This project has been updated to use **cookie-based authentication** instead of localStorage for enhanced security:

### Benefits
- ✅ **HttpOnly cookies** prevent XSS attacks
- ✅ **SameSite protection** prevents CSRF attacks
- ✅ **Automatic transmission** with every request
- ✅ **Server-side control** over token lifecycle

### Changes Made
- Backend: Added cookie-parser middleware
- Backend: Set tokens in httpOnly cookies
- Backend: Added `/api/admin/me` endpoint
- Frontend: Removed localStorage token storage
- Frontend: Added `withCredentials: true` to axios
- Frontend: Authentication via `/api/admin/me` endpoint

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)

