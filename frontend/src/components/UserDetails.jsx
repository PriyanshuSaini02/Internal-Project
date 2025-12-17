import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userAPI } from "../services/api";
import Spinner from "./ui/Spinner";
import Toast from "./ui/Toast";
import "./UserDetails.css";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  // 🔔 toast state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getById(id);
      setUser(response.data.user);
    } catch (err) {
      showToast("error", err.response?.data?.msg || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      await userAPI.uploadProfilePicture(id, file);
      showToast("success", "Profile picture updated");
      fetchUser();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.msg || "Failed to upload profile picture"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProfileImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith("http")) return profilePicture;
    return `http://localhost:5000${profilePicture}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <Spinner label="Loading user details..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details-container">
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="user-details-container">
      <div className="user-details-card">
        <div className="details-header">
          <h2>User Details</h2>
          <button
            className="btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="user-details-content">
          <div className="profile-section">
            <div className="profile-picture-container">
              {getProfileImageUrl(user.profilePicture) ? (
                <img
                  src={getProfileImageUrl(user.profilePicture)}
                  alt={user.name}
                  className="profile-picture"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
              ) : (
                <div className="profile-placeholder-large">
                  No Profile Picture
                </div>
              )}

              <div className="upload-section">
                <label htmlFor="profile-upload" className="btn-upload">
                  {uploading ? "Uploading..." : "Upload Profile Picture"}
                </label>

                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </div>
            </div>
          </div>

          <div className="details-section">
            <div className="detail-item">
              <label>User ID</label>
              <p>{user.userId}</p>
            </div>

            <div className="detail-item">
              <label>Name</label>
              <p>{user.name}</p>
            </div>

            <div className="detail-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="detail-item">
              <label>Type</label>
              <p>
                <span
                  className={`type-badge ${
                    user.type
                      ? user.type.toLowerCase().replace("-", "")
                      : "unknown"
                  }`}
                >
                  {user.type || "N/A"}
                </span>
              </p>
            </div>

            <div className="detail-item">
              <label>Date of Birth</label>
              <p>{formatDate(user.dob)}</p>
            </div>

            <div className="detail-item">
              <label>Date of Joining</label>
              <p>{formatDate(user.doj)}</p>
            </div>

            <div className="detail-item">
              <label>Phone Number</label>
              <p>{user.phoneNumber || "N/A"}</p>
            </div>

            <div className="detail-item">
              <label>Projects</label>
              <p>
                {user.project && user.project.length > 0
                  ? user.project.join(", ")
                  : "N/A"}
              </p>
            </div>

            <div className="detail-item">
              <label>Address</label>
              <p>{user.address || "N/A"}</p>
            </div>

            <div className="detail-item">
              <label>Created At</label>
              <p>{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="details-actions">
          <button
            className="btn-primary"
            onClick={() => navigate(`/users/${user.userId}/edit`)}
          >
            Edit User
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

export default UserDetails;
