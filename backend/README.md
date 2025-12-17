# Backend (Express + MongoDB)

REST API for admin authentication and user management with comprehensive CRUD operations, file uploads, and email services. **Now using cookie-based JWT authentication** for enhanced security.

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
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/your-db

# Authentication
JWT_SECRET=super-secret-key

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_USER=your_smtp_user
EMAIL_PASSWORD=your_smtp_pass
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

## API Base
- Default: `http://localhost:5000/api`

## Project Structure
```
backend/
├── controllers/
│   ├── adminController.js    # Admin auth & password reset (cookie-based)
│   └── userController.js     # User CRUD & profile management
├── models/
│   ├── admin.js             # Admin schema
│   └── user.js              # User schema with auto-generated IDs
├── routes/
│   ├── adminRoute.js        # Admin endpoints
│   └── userRoute.js         # User endpoints
├── middleware/
│   ├── adminAuth.js         # JWT cookie authentication middleware
│   └── upload.js            # Multer file upload configuration
├── utils/
│   └── emailService.js      # Email sending utilities
├── db/
│   └── db.js               # MongoDB connection
└── index.js                # Express server setup with cookie-parser
```

## Auth Endpoints (`/api/admin`)
- `POST /register` – create admin account, sets httpOnly cookie
- `POST /login` – login, sets httpOnly cookie with JWT
- `POST /logout` – logout, clears authentication cookie
- `GET /me` – get current admin info (requires cookie authentication)
- `POST /forgot-password` – send reset email with token
- `POST /reset-password` – reset password with valid token
- `GET /verify-reset-token/:token` – validate reset token

## User Endpoints (`/api/users`) – require cookie authentication
- `POST /add` – create user with auto-generated credentials
- `GET /` – list all users (sorted by creation date)
- `GET /deleted` – list soft-deleted users
- `GET /search` – search users by query parameters
- `GET /:id` – get user by userId (format: EM-XXXXXX)
- `PUT /:id` – update user information
- `DELETE /:id` – soft delete user
- `POST /:id/restore` – restore soft-deleted user
- `POST /:id/profile-picture` – upload profile image (Cloudinary)
- `GET /:id/profile-picture` – serve/redirect to profile image

## Key Features

### Cookie-Based Authentication
- **HttpOnly Cookies**: JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
- **SameSite Protection**: Cookies configured with `sameSite: 'strict'` to prevent CSRF
- **Secure Flag**: Enabled in production for HTTPS-only transmission
- **Automatic Transmission**: Cookies sent automatically with every request
- **Token Expiration**: 1-day expiry for auth tokens, 1-hour for reset tokens

### User Management
- **Auto-generated User IDs**: Format `EM-XXXXXX` (6-digit random)
- **Auto-generated Passwords**: 8-character UUID-based passwords
- **Email Notifications**: Automatic credential emails to new users
- **Profile Pictures**: Cloudinary integration with automatic cleanup
- **Soft Delete**: Users can be deleted and restored

### Security
- **Cookie-Parser Middleware**: Parses cookies from requests
- **CORS with Credentials**: Configured to accept cookies from frontend
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Token Validation**: Purpose-specific tokens for password reset
- **Admin Protection**: All user operations require cookie authentication

### File Management
- **Cloudinary Integration**: Automatic upload to `snabbtech/profiles` folder
- **File Cleanup**: Automatic deletion of old profile pictures
- **Error Handling**: Graceful handling of upload failures

### Email Services
- **User Credentials**: Welcome emails with login information
- **Password Reset**: Secure reset links with expiring tokens
- **SMTP Support**: Configurable email service (Gmail tested)

## Authentication Flow

### Login/Register
1. Client sends credentials to `/api/admin/login` or `/api/admin/register`
2. Server validates credentials and generates JWT
3. JWT stored in httpOnly cookie via `res.cookie()`
4. Cookie configuration:
   ```javascript
   {
     httpOnly: true,              // Not accessible via JavaScript
     secure: NODE_ENV === 'production',  // HTTPS only in production
     sameSite: 'strict',          // CSRF protection
     maxAge: 24 * 60 * 60 * 1000  // 1 day
   }
   ```
5. Client receives response with admin data (token in cookie)

### Authenticated Requests
1. Client makes request (cookie sent automatically)
2. `adminAuth` middleware extracts token from `req.cookies.token`
3. Token validated and admin info attached to `req.admin`
4. Request proceeds to route handler

### Logout
1. Client calls `/api/admin/logout`
2. Server clears cookie via `res.clearCookie()`
3. Client session ends

## Dependencies
```json
{
  "bcryptjs": "^3.0.3",           // Password hashing
  "cloudinary": "^1.41.3",        // File storage
  "cookie-parser": "^1.4.6",      // Cookie parsing middleware
  "cors": "^2.8.5",               // Cross-origin requests (with credentials)
  "dotenv": "^17.2.3",            // Environment variables
  "express": "^5.2.1",            // Web framework
  "jsonwebtoken": "^9.0.3",       // JWT tokens
  "mongoose": "^9.0.1",           // MongoDB ODM
  "multer": "^2.0.2",             // File uploads
  "streamifier": "^0.1.1",        // Stream utilities
  "nodemailer": "^7.0.11",        // Email sending
  "nodemon": "^3.1.11",           // Development server
  "uuid": "^13.0.0"               // Unique ID generation
}
```

## CORS Configuration
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true  // Allow cookies to be sent
}));
```

## Middleware Setup
```javascript
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());  // Parse cookies from requests
```

## Static Files
- `/uploads` directory is served for any local file storage needs
- Profile pictures are primarily stored on Cloudinary

## Important Notes

### Cookie Authentication
- **Cookie Name**: `token`
- **Cookie Parser**: Required middleware for reading cookies
- **CORS**: Must include `credentials: true` to allow cookies
- **Frontend**: Must send requests with `withCredentials: true`
- **Production**: Use `secure: true` and HTTPS

### Reset Links
- Email reset links point to `FRONTEND_URL/reset-password/:token`

### User IDs
- Custom format `EM-XXXXXX` instead of MongoDB ObjectIds

### Email Configuration
- Ensure SMTP credentials are valid for email functionality

### Cloudinary Setup
- All three Cloudinary environment variables are required for file uploads

## Error Handling
- Comprehensive error responses with appropriate HTTP status codes
- Graceful handling of duplicate emails, missing users, invalid tokens
- Automatic cleanup of resources on failures
- Detailed server-side logging for debugging

## Development Tips
- Use Postman or similar tools to test API endpoints
- **Important**: Enable "Send cookies" in Postman for authenticated requests
- Check MongoDB connection before starting the server
- Verify email configuration by testing the forgot password flow
- Monitor Cloudinary usage for file upload limits
- Use browser DevTools → Application → Cookies to inspect authentication cookies

## Production Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure `FRONTEND_URL` to production domain
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Verify CORS allows production frontend origin
- [ ] Test cookie transmission in production environment
- [ ] Monitor cookie security settings

## Security Best Practices
- ✅ HttpOnly cookies prevent XSS attacks
- ✅ SameSite cookies prevent CSRF attacks
- ✅ Secure flag ensures HTTPS-only transmission
- ✅ Short token expiration (1 day) limits exposure
- ✅ Password hashing with bcrypt
- ✅ Environment variable protection

## Migration from Bearer Tokens
This backend has been updated from Bearer token authentication to cookie-based authentication:

**Before**: Client stored JWT in localStorage and sent via Authorization header
**After**: Server stores JWT in httpOnly cookie, automatically sent with requests

**Benefits**:
- Enhanced security (XSS protection)
- Simplified client-side code
- Automatic token transmission
- Server-side token lifecycle control