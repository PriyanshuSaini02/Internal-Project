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
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        project: Array.isArray(user.project) ? user.project.join(', ') : '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const submitData = {
      ...formData,
      project: formData.project.split(',').map((p) => p.trim()).filter((p) => p),
    };

    try {
      if (isEdit) {
        await userAPI.update(id, submitData);
      } else {
        await userAPI.create(submitData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${isEdit ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="loading">
        <Spinner label="Loading user data..." />
      </div>
    );
  }

  return (
    <div className="user-form-container">
      <div className="user-form-card">
        <div className="form-header">
          <h2>{isEdit ? 'Edit User' : 'Add New User'}</h2>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={30}
                placeholder="Enter user name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter user email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="project">Projects * (comma-separated)</label>
            <input
              type="text"
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
              placeholder="e.g., Project A, Project B"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter user address"
            />
          </div>

          {error && <Alert type="error">{error}</Alert>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <Spinner label={isEdit ? 'Updating...' : 'Creating...'} />
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

