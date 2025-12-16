# Backend (Express + MongoDB)

REST API for admin authentication and user management with comprehensive CRUD operations, file uploads, and email services.

## Prerequisites
- Node.js 18+
- MongoDB URI
- Cloudinary Account (for profile picture uploads)
- SMTP Email Service (Gmail recommended)

## Install & Run
```bash
cd backend
npm install
npm start   # runs via nodemon
```

## Environment (.env)
```
PORT=5000
MONGO_URL=mongodb://localhost:27017/your-db
JWT_SECRET=super-secret-key
EMAIL_USER=your_smtp_user
EMAIL_PASSWORD=your_smtp_pass
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
FRONTEND_URL=http://localhost:5173   # used for password reset links
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

## API Base
- Default: `http://localhost:3000/api`

## Project Structure
```
backend/
├── controllers/
│   ├── adminController.js    # Admin auth & password reset
│   └── userController.js     # User CRUD & profile management
├── models/
│   ├── admin.js             # Admin schema
│   └── user.js              # User schema with auto-generated IDs
├── routes/
│   ├── adminRoute.js        # Admin endpoints
│   └── userRoute.js         # User endpoints
├── middleware/
│   ├── adminAuth.js         # JWT authentication middleware
│   └── upload.js            # Multer file upload configuration
├── utils/
│   └── emailService.js      # Email sending utilities
├── db/
│   └── db.js               # MongoDB connection
└── index.js                # Express server setup
```

## Auth Endpoints (`/api/admin`)
- `POST /register` – create admin account
- `POST /login` – login, returns JWT token
- `POST /forgot-password` – send reset email with token
- `POST /reset-password` – reset password with valid token
- `GET /verify-reset-token/:token` – validate reset token

## User Endpoints (`/api/users`) – require Bearer JWT
- `POST /add` – create user with auto-generated credentials
- `GET /` – list all users (sorted by creation date)
- `GET /:id` – get user by userId (format: EM-XXXXXX)
- `PUT /:id` – update user information
- `DELETE /:id` – delete user and associated files
- `POST /:id/profile-picture` – upload profile image (Cloudinary)
- `GET /:id/profile-picture` – serve/redirect to profile image

## Key Features

### User Management
- **Auto-generated User IDs**: Format `EM-XXXXXX` (6-digit random)
- **Auto-generated Passwords**: 8-character UUID-based passwords
- **Email Notifications**: Automatic credential emails to new users
- **Profile Pictures**: Cloudinary integration with automatic cleanup

### Security
- **JWT Authentication**: 1-day expiry for auth tokens, 1-hour for reset tokens
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Token Validation**: Purpose-specific tokens for password reset
- **Admin Protection**: All user operations require admin authentication

### File Management
- **Cloudinary Integration**: Automatic upload to `snabbtech/profiles` folder
- **File Cleanup**: Automatic deletion of old profile pictures
- **Error Handling**: Graceful handling of upload failures

### Email Services
- **User Credentials**: Welcome emails with login information
- **Password Reset**: Secure reset links with expiring tokens
- **SMTP Support**: Configurable email service (Gmail tested)

## Dependencies
```json
{
  "bcryptjs": "^3.0.3",           // Password hashing
  "cloudinary": "^1.41.3",       // File storage
  "cors": "^2.8.5",              // Cross-origin requests
  "dotenv": "^17.2.3",           // Environment variables
  "express": "^5.2.1",           // Web framework
  "jsonwebtoken": "^9.0.3",      // JWT tokens
  "mongoose": "^9.0.1",          // MongoDB ODM
  "multer": "^2.0.2",            // File uploads
  "streamifier": "^0.1.1",       // Stream utilities
  "nodemailer": "^7.0.11",       // Email sending
  "nodemon": "^3.1.11",          // Development server
  "uuid": "^13.0.0"              // Unique ID generation
}
```

## Static Files
- `/uploads` directory is served for any local file storage needs
- Profile pictures are primarily stored on Cloudinary

## Important Notes
- **Reset Links**: Email reset links point to `FRONTEND_URL/reset-password/:token`
- **Authentication**: Admin-protected routes use `adminAuth` middleware expecting `Authorization: Bearer <token>`
- **User IDs**: Custom format `EM-XXXXXX` instead of MongoDB ObjectIds
- **Email Configuration**: Ensure SMTP credentials are valid for email functionality
- **Cloudinary Setup**: All three Cloudinary environment variables are required for file uploads

## Error Handling
- Comprehensive error responses with appropriate HTTP status codes
- Graceful handling of duplicate emails, missing users, invalid tokens
- Automatic cleanup of resources on failures
- Detailed server-side logging for debugging

## Development Tips
- Use Postman or similar tools to test API endpoints
- Check MongoDB connection before starting the server
- Verify email configuration by testing the forgot password flow
- Monitor Cloudinary usage for file upload limits