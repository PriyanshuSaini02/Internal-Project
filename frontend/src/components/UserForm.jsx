import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI } from '../services/api';
import Alert from './ui/Alert';
import Spinner from './ui/Spinner';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    project: '',
    address: '',
    phoneNumber: '',
  });

  // 🔑 Profile picture states
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

  /* ================= FETCH USER (EDIT) ================= */
  useEffect(() => {
    if (isEdit) {
      fetchUser();
    }
  }, [id, isEdit]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getById(id);
      const user = response.data.user;

      setFormData({
        name: user.name || '',
        email: user.email || '',
        dob: user.dob
          ? new Date(user.dob).toISOString().split('T')[0]
          : '',
        project: Array.isArray(user.project)
          ? user.project.join(', ')
          : '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
      });

      // 🔑 Existing profile picture preview
      if (user.profilePicture) {
        setProfilePreview(
          user.profilePicture.startsWith('http')
            ? user.profilePicture
            : `http://localhost:5000${user.profilePicture}`
        );
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploadError('');
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const submitData = {
      ...formData,
      project: formData.project
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    };

    try {
      let userId = id;

      if (isEdit) {
        await userAPI.update(id, submitData);
      } else {
        const res = await userAPI.create(submitData);
        userId = res.data.user.userId || res.data.user._id;
      }

      // 🔑 Upload DP if selected
      if (profileFile && userId) {
        await userAPI.uploadProfilePicture(userId, profileFile);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          `Failed to ${isEdit ? 'update' : 'create'} user`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading && isEdit) {
    return (
      <div className="loading">
        <Spinner label="Loading user data..." />
      </div>
    );
  }

  /* ================= JSX ================= */
  return (
    <div className="user-form-container">
      <div className="user-form-card">
        <div className="form-header">
          <h2>{isEdit ? 'Edit User' : 'Add New User'}</h2>
          <button
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 🔑 PROFILE UPLOAD */}
          <div className="profile-upload-section">
            <div className="profile-preview">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile preview" />
              ) : (
                <div className="profile-placeholder">No Image</div>
              )}
            </div>

            <label className="btn-secondary">
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileChange}
              />
            </label>

            {uploadError && <Alert type="error">{uploadError}</Alert>}
          </div>

          {/* FORM FIELDS */}
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Projects * (comma-separated)</label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {error && <Alert type="error">{error}</Alert>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  label={isEdit ? 'Updating...' : 'Creating...'}
                />
              ) : isEdit ? (
                'Update User'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
