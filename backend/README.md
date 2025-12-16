# Backend (Express + MongoDB)

REST API for admin authentication and user management.

## Prerequisites
- Node.js 18+
- MongoDB URI

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
FRONTEND_URL=http://localhost:xyz   # used for password reset links
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

## API Base
- Default: `http://localhost:5000/api`

## Auth Endpoints (`/api/admin`)
- `POST /register` – create admin
- `POST /login` – login, returns JWT
- `POST /forgot-password` – send reset email
- `POST /reset-password` – reset password with token
- `GET /verify-reset-token/:token` – validate reset token

## User Endpoints (`/api/users`) – require Bearer JWT
- `POST /add` – create user
- `GET /` – list users
- `GET /:id` – get user by userId
- `PUT /:id` – update user
- `DELETE /:id` – delete user
- `POST /:id/profile-picture` – upload profile image (multer)
- `GET /:id/profile-picture` – serve profile image

## Static
- `/uploads` is served for profile pictures.

## Notes
- Reset email links are built with `FRONTEND_URL/reset-password/:token`. Ensure `FRONTEND_URL` matches where the frontend is hosted.
- Admin-protected routes use the `adminAuth` middleware (expects `Authorization: Bearer <token>`).

