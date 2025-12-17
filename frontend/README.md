# Frontend (Vite + React)

Modern admin dashboard for authentication and user management, built with React 19, Vite, and React Router. Features a responsive design with comprehensive user management capabilities. **Now using cookie-based authentication** for enhanced security.

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
```env
VITE_API_URL=http://localhost:5000/api   # backend base URL
```

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
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx         # Main dashboard with user stats
│   │   │   ├── DashboardHeader.jsx   # Dashboard header component
│   │   │   ├── EmptyState.jsx        # Empty state component
│   │   │   ├── SearchBar.jsx         # Search functionality
│   │   │   ├── UserRow.jsx           # User table row
│   │   │   └── UserTable.jsx         # User listing table
│   │   ├── ForgotPassword.jsx        # Password reset request form
│   │   ├── Home.jsx                  # Landing page for authenticated users
│   │   ├── Login.jsx                 # Admin login form
│   │   ├── ProtectedRoute.jsx        # Route protection component
│   │   ├── Register.jsx              # Admin registration form
│   │   ├── ResetPassword.jsx         # New password form with token
│   │   ├── Section.jsx               # Section wrapper component
│   │   ├── Settings.jsx              # Admin settings page
│   │   ├── SidebarLayout.jsx         # Main layout with navigation
│   │   ├── UserDetails.jsx           # Individual user view
│   │   ├── UserForm.jsx              # User create/edit form
│   │   └── ui/
│   │       ├── Alert.jsx             # Reusable alert component
│   │       ├── Spinner.jsx           # Loading spinner component
│   │       └── Toast.jsx             # Toast notification component
│   ├── context/
│   │   └── AuthContext.jsx           # Cookie-based authentication state
│   ├── services/
│   │   └── api.js                    # Axios config with credentials
│   ├── assets/                       # Static assets
│   ├── App.jsx                       # Main app component with routing
│   ├── App.css                       # Global styles
│   ├── Auth.css                      # Authentication page styles
│   ├── index.css                     # Base CSS
│   └── main.jsx                      # React app entry point
├── public/
│   └── vite.svg                      # Vite logo
├── index.html                        # HTML template
├── vite.config.js                    # Vite configuration
└── eslint.config.js                  # ESLint configuration
```

## Features

### Cookie-Based Authentication System
- **HttpOnly Cookie Storage** - JWT tokens stored securely in httpOnly cookies
- **Automatic Token Transmission** - Cookies sent automatically with every request
- **Session Validation** - Uses `/api/admin/me` endpoint to validate session
- **Protected Routes** - Automatic redirect for unauthenticated users
- **Password Reset Flow** - Complete forgot/reset password functionality
- **Secure Logout** - Clears server-side cookie on logout
- **No localStorage** - Enhanced security by avoiding client-side token storage

### User Management
- **User Dashboard** - Overview with user statistics
- **User Listing** - Paginated user table with search functionality
- **User Creation** - Form with auto-generated credentials
- **User Editing** - Update user information
- **User Details** - Individual user profile view
- **Profile Pictures** - Upload and display user profile images
- **User Deletion** - Soft delete with restore capability
- **Deleted Users View** - Manage soft-deleted users

### UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Interface** - Clean, professional admin dashboard design
- **Loading States** - Spinners and loading indicators
- **Toast Notifications** - User-friendly success/error messages
- **Error Handling** - Comprehensive error messages and alerts
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
// Admin authentication (cookie-based)
adminAPI.register(data)           // POST /admin/register (sets cookie)
adminAPI.login(data)              // POST /admin/login (sets cookie)
adminAPI.logout()                 // POST /admin/logout (clears cookie)
adminAPI.getMe()                  // GET /admin/me (validates cookie)
adminAPI.forgotPassword(data)     // POST /admin/forgot-password
adminAPI.resetPassword(data)      // POST /admin/reset-password
adminAPI.verifyResetToken(token)  // GET /admin/verify-reset-token/:token
```

### User Management APIs
```javascript
// User CRUD operations
userAPI.getAll()                  // GET /users
userAPI.getDeleted()              // GET /users/deleted
userAPI.search(params)            // GET /users/search
userAPI.getById(id)               // GET /users/:id
userAPI.create(data)              // POST /users/add
userAPI.update(id, data)          // PUT /users/:id
userAPI.delete(id)                // DELETE /users/:id
userAPI.restore(id)               // POST /users/:id/restore

// Profile picture management
userAPI.uploadProfilePicture(id, file)  // POST /users/:id/profile-picture
userAPI.getProfilePicture(id)           // GET /users/:id/profile-picture
```

## Dependencies
```json
{
  "dependencies": {
    "axios": "^1.7.7",              // HTTP client with credentials support
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

### AuthContext (Cookie-Based)
- Manages authentication state globally
- Validates session via `/api/admin/me` endpoint on mount
- Handles login/logout functionality
- **No localStorage usage** - relies on httpOnly cookies
- Provides user information across components
- Automatic session validation

### API Service (with Credentials)
- Centralized Axios configuration
- **`withCredentials: true`** - Enables cookie transmission
- Response interceptors for error handling
- Automatic logout on 401 responses
- No Authorization header needed (cookies sent automatically)

### Protected Routes
- Route-level authentication protection
- Automatic redirect to login for unauthenticated users
- Preserves intended destination after login
- Loading state during authentication check

## Authentication Flow

### Login Flow
1. User submits credentials to `/api/admin/login`
2. Backend validates and sets httpOnly cookie
3. Frontend receives admin data (no token in response)
4. AuthContext updates state with admin info
5. User redirected to dashboard

### Session Validation (on page load)
1. AuthContext calls `/api/admin/me` on mount
2. Cookie automatically sent with request
3. If valid, backend returns admin info
4. If invalid (401), user redirected to login

### Logout Flow
1. User clicks logout
2. Frontend calls `/api/admin/logout`
3. Backend clears authentication cookie
4. Frontend clears admin state
5. User redirected to login

## Configuration Notes
- **API Base URL**: Configured via `VITE_API_URL` environment variable
- **Default Backend**: Expects backend on `http://localhost:5000/api`
- **Credentials**: All API requests include `withCredentials: true`
- **CORS**: Backend must allow credentials from frontend origin
- **Cookie Storage**: Tokens stored in httpOnly cookies (not accessible via JavaScript)

## Axios Configuration
```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for cross-origin requests
});
```

## Development Tips
- **Hot Reload**: Vite provides instant hot module replacement
- **API Testing**: Use browser dev tools to monitor API calls
- **Cookie Inspection**: Check Application → Cookies in DevTools
- **State Debugging**: React DevTools for component state inspection
- **Error Handling**: Check browser console for detailed error messages
- **CORS Issues**: Ensure backend CORS allows credentials from your origin

## Production Deployment
1. Set production `VITE_API_URL` in environment
2. Run `npm run build` to create optimized build
3. Serve the `dist` folder with a web server
4. **Ensure backend allows credentials from production domain**
5. **Use HTTPS** for secure cookie transmission
6. Verify cookies are set with `secure: true` in production

## Browser Support
- Modern browsers with ES6+ support
- Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- Mobile browsers on iOS Safari 14+ and Chrome Mobile 88+
- **Cookie support required** (enabled by default in all modern browsers)

## Security Considerations

### Cookie-Based Authentication Benefits
- ✅ **HttpOnly cookies** prevent XSS attacks (JavaScript cannot access token)
- ✅ **SameSite protection** prevents CSRF attacks
- ✅ **Automatic transmission** reduces implementation errors
- ✅ **Server-side control** over token lifecycle
- ✅ **No localStorage exposure** eliminates client-side token theft risk

### Production Security Checklist
- [ ] Use HTTPS (required for secure cookies)
- [ ] Verify backend sets `secure: true` in production
- [ ] Ensure CORS allows only trusted origins
- [ ] Test cookie transmission in production environment
- [ ] Implement proper error handling for 401 responses
- [ ] Use strong passwords and enable 2FA where possible

## Migration from localStorage

This frontend has been updated from localStorage-based authentication to cookie-based authentication:

### Changes Made
1. **Removed localStorage usage** - No more `localStorage.getItem('token')`
2. **Added withCredentials** - Axios configured with `withCredentials: true`
3. **Session validation** - Uses `/api/admin/me` instead of localStorage check
4. **Logout API call** - Calls backend to clear cookie
5. **No Authorization header** - Cookies sent automatically

### Benefits
- Enhanced security (XSS protection)
- Simplified authentication logic
- Automatic token transmission
- Server-side session control

## Troubleshooting

### Cookies Not Being Sent
- Ensure `withCredentials: true` in axios config
- Check backend CORS allows credentials
- Verify backend and frontend are on same domain or properly configured for cross-origin

### Authentication Not Persisting
- Check browser allows cookies
- Verify backend sets cookie correctly
- Inspect cookies in DevTools → Application → Cookies
- Ensure backend cookie configuration matches environment

### 401 Errors After Login
- Check `/api/admin/me` endpoint is working
- Verify cookie is being set by backend
- Ensure cookie name matches backend configuration
- Check cookie domain and path settings

## Additional Resources
- [Axios Documentation](https://axios-http.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Cookie Security Best Practices](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#credentialed_requests_and_wildcards)