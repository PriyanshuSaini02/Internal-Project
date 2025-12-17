import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import Spinner from "./ui/Spinner";
import Toast from "./ui/Toast";
import "./Layout.css";
import "./Setting.css";

const Settings = () => {
  const { admin } = useAuth();
  const [loading, setLoading] = useState(false);

  // 🔔 toast state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const sendResetLink = async () => {
    if (!admin?.email) {
      showToast("error", "No admin email available.");
      return;
    }

    setLoading(true);

    try {
      await adminAPI.forgotPassword({ email: admin.email });
      showToast(
        "success",
        "Reset link sent to your email. Please check your inbox."
      );
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.msg || "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1 className="panel__title">Account & Security</h1>
          <p className="panel__subtitle">
            Manage your admin account and reset your password.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Reset password</h3>
        <p className="panel__subtitle">
          We’ll email a secure link to reset your password.
        </p>

        <div className="setting-row">
          <div>
            <div className="label">Email</div>
            <div className="value">{admin?.email || "Not available"}</div>
          </div>

          <button
            className="btn-primary"
            onClick={sendResetLink}
            disabled={loading}
          >
            {loading ? <Spinner label="Sending..." /> : "Send reset link"}
          </button>
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

export default Settings;
