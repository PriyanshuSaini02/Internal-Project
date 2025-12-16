import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Alert from './ui/Alert';
import Spinner from './ui/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userAPI.delete(userId);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getProfileImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    return `http://localhost:5000${profilePicture}`;
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>User Management Dashboard</h1>
          <p>Welcome, {admin?.name}</p>
        </div>

        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate('/users/add')}
          >
            + Add User
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="dashboard-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn-secondary ghost"
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <div className="loading">
            <Spinner label="Loading users..." />
          </div>
        ) : (
          <div className="users-table-container">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>No users found</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/users/add')}
                >
                  Add First User
                </button>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User ID</th>
                    <th>Date of Birth</th>
                    <th>Projects</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        {getProfileImageUrl(user.profilePicture) ? (
                          <img
                            src={getProfileImageUrl(user.profilePicture)}
                            alt={user.name}
                            className="profile-thumbnail"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/40';
                            }}
                          />
                        ) : (
                          <div className="profile-placeholder">No Image</div>
                        )}
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.userId}</td>
                      <td>{formatDate(user.dob)}</td>
                      <td>
                        {user.project && user.project.length > 0
                          ? user.project.join(', ')
                          : 'N/A'}
                      </td>
                      <td>{user.phoneNumber || 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-view"
                            onClick={() =>
                              navigate(`/users/${user.userId}`)
                            }
                          >
                            View
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() =>
                              navigate(`/users/${user.userId}/edit`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() =>
                              handleDelete(user.userId)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
