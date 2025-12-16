# Frontend (Vite + React)

Modern admin dashboard for authentication and user management, built with React 19, Vite, and React Router. Features a responsive design with comprehensive user management capabilities.

## Prerequisites
- Node.js 18+
- Backend server running on configured port

## Install & Run
```bash
cd frontend
npm install
npm run dev   # starts Vite dev server (default: http://localhost:5173)
```

## Environment
Create `frontend/.env` (or use `.env.local`):
```
VITE_API_URL=http://localhost:5000/api   # backend base URL
```
**Note**: Backend default is port 5000, not 3000 as mentioned in original README.

## Available Scripts
- `npm run dev` – start development server
- `npm run build` – production build
- `npm run preview` – preview built app
- `npm run lint` – lint sources with ESLint

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx         # Main dashboard with user stats
│   │   ├── ForgotPassword.jsx    # Password reset request form
│   │   ├── Home.jsx             # Landing page for authenticated users
│   │   ├── Login.jsx            # Admin login form
│   │   ├── ProtectedRoute.jsx   # Route protection component
│   │   ├── Register.jsx         # Admin registration form
│   │   ├── ResetPassword.jsx    # New password form with token
│   │   ├── Settings.jsx         # Admin settings page
│   │   ├── SidebarLayout.jsx    # Main layout with navigation
│   │   ├── UserDetails.jsx      # Individual user view
│   │   ├── UserForm.jsx         # User create/edit form
│   │   └── ui/
│   │       ├── Alert.jsx        # Reusable alert component
│   │       └── Spinner.jsx      # Loading spinner component
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── services/
│   │   └── api.js              # Axios configuration & API calls
│   ├── assets/                 # Static assets
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Global styles
│   ├── index.css               # Base CSS
│   └── main.jsx                # React app entry point
├── public/
│   └── vite.svg                # Vite logo
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
└── eslint.config.js            # ESLint configuration
```

## Features

### Authentication System
- **Admin Login/Register** - JWT-based authentication
- **Protected Routes** - Automatic redirect for unauthenticated users
- **Password Reset Flow** - Complete forgot/reset password functionality
- **Token Management** - Automatic token refresh and logout on expiry
- **Persistent Sessions** - LocalStorage-based session persistence

### User Management
- **User Dashboard** - Overview with user statistics
- **User Listing** - Paginated user table with search functionality
- **User Creation** - Form with auto-generated credentials
- **User Editing** - Update user information
- **User Details** - Individual user profile view
- **Profile Pictures** - Upload and display user profile images
- **User Deletion** - Remove users with confirmation

### UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Interface** - Clean, professional admin dashboard design
- **Loading States** - Spinners and loading indicators
- **Error Handling** - User-friendly error messages and alerts
- **Form Validation** - Client-side validation with error feedback
- **Navigation** - Sidebar navigation with active state indicators

## Routing (SPA)
```
Authentication Routes:
├── /login                    # Admin login page
├── /register                 # Admin registration page
├── /forgot-password          # Password reset request
└── /reset-password/:token    # Password reset with token

Protected Routes (require authentication):
├── /                        # Home page (redirects to dashboard)
├── /home                    # Landing page
├── /dashboard               # Main dashboard with stats
├── /users/add               # Create new user form
├── /users/:id               # User details view
├── /users/:id/edit          # Edit user form
└── /settings                # Admin settings
```

## API Integration

### Authentication APIs
```javascript
// Admin authentication
adminAPI.register(data)           // POST /admin/register
adminAPI.login(data)              // POST /admin/login
adminAPI.forgotPassword(data)     // POST /admin/forgot-password
adminAPI.resetPassword(data)      // POST /admin/reset-password
adminAPI.verifyResetToken(token)  // GET /admin/verify-reset-token/:token
```

### User Management APIs
```javascript
// User CRUD operations
userAPI.getAll()                  // GET /users
userAPI.getById(id)               // GET /users/:id
userAPI.create(data)              // POST /users/add
userAPI.update(id, data)          // PUT /users/:id
userAPI.delete(id)                // DELETE /users/:id

// Profile picture management
userAPI.uploadProfilePicture(id, file)  // POST /users/:id/profile-picture
userAPI.getProfilePicture(id)           // GET /users/:id/profile-picture
```

## Dependencies
```json
{
  "dependencies": {
    "axios": "^1.7.7",              // HTTP client with interceptors
    "lucide-react": "^0.561.0",     // Modern icon library
    "react": "^19.2.0",             // React framework
    "react-dom": "^19.2.0",         // React DOM renderer
    "react-router-dom": "^6.26.0"   // Client-side routing
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",  // Vite React plugin
    "eslint": "^9.39.1",               // Code linting
    "vite": "^7.2.4"                   // Build tool and dev server
  }
}
```

## Key Components

### AuthContext
- Manages authentication state globally
- Handles login/logout functionality
- Provides user information across components
- Automatic token validation and refresh

### API Service
- Centralized Axios configuration
- Automatic token injection for authenticated requests
- Response interceptors for error handling
- Automatic logout on 401 responses

### Protected Routes
- Route-level authentication protection
- Automatic redirect to login for unauthenticated users
- Preserves intended destination after login

## Configuration Notes
- **API Base URL**: Configured via `VITE_API_URL` environment variable
- **Default Backend**: Expects backend on `http://localhost:5000/api`
- **Token Storage**: Uses localStorage for JWT token persistence
- **CORS**: Ensure backend CORS is configured for frontend domain

## Development Tips
- **Hot Reload**: Vite provides instant hot module replacement
- **API Testing**: Use browser dev tools to monitor API calls
- **State Debugging**: React DevTools for component state inspection
- **Error Handling**: Check browser console for detailed error messages

## Production Deployment
1. Set production `VITE_API_URL` in environment
2. Run `npm run build` to create optimized build
3. Serve the `dist` folder with a web server
4. Ensure backend CORS allows your production domain

## Browser Support
- Modern browsers with ES6+ support
- Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- Mobile browsers on iOS Safari 14+ and Chrome Mobile 88+

## Security Considerations
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic logout on token expiry
- Protected routes prevent unauthorized access
- Form validation prevents malicious input
- HTTPS recommended for production deployment