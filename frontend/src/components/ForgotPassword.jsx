import { useState } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../services/api";
import Spinner from "./ui/Spinner";
import Toast from "./ui/Toast";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔔 toast state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("error", "Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await adminAPI.forgotPassword({ email: email.trim() });
      showToast(
        "success",
        "Password reset email sent! Please check your inbox."
      );
      setEmail("");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.msg || "Failed to send reset email"
      );
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

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !email}
          >
            {loading ? <Spinner label="Sending..." /> : "Send Reset Link"}
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

export default ForgotPassword;
