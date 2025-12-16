import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Alert from './ui/Alert';
import Spinner from './ui/Spinner';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await adminAPI.forgotPassword({ email: email.trim() });
      setMessage('Password reset email sent! Please check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trimStart())}
              required
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
          {error && <Alert type="error">{error}</Alert>}
          {message && <Alert type="success">{message}</Alert>}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !email}
          >
            {loading ? <Spinner label="Sending..." /> : 'Send Reset Link'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

