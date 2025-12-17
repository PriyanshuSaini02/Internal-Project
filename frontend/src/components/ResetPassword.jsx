import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { adminAPI } from "../services/api";
import Spinner from "./ui/Spinner";
import Toast from "./ui/Toast";
import "./Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  // 🔔 toast state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await adminAPI.verifyResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        showToast("error", "Invalid or expired reset token");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      showToast("error", "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await adminAPI.resetPassword({
        token,
        newPassword: formData.newPassword,
      });

      showToast("success", "Password reset successful. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showToast("error", err.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOKEN VERIFY STATES ================= */

  if (tokenValid === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <Spinner label="Verifying token..." />
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Reset Password</h2>

          <div className="auth-links">
            <Link to="/forgot-password">Request new reset link</Link>
            <span> | </span>
            <Link to="/login">Back to Login</Link>
          </div>

          {toast && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password (min 8 characters)"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={
              loading || !formData.newPassword || !formData.confirmPassword
            }
          >
            {loading ? <Spinner label="Resetting..." /> : "Reset Password"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>

      {/* 🔔 Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ResetPassword;
