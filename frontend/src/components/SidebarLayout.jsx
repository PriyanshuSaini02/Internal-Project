import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const SidebarLayout = ({ children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR OVERLAY */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">S</div>
          <div className="brand-text">
            <div className="sidebar__title">Snabbtech</div>
            <div className="sidebar__subtitle">Admin</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink to="/home" className="sidebar__link">
            <Home />
            <span>Home</span>
          </NavLink>

          <NavLink to="/dashboard" className="sidebar__link">
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/settings" className="sidebar__link">
            <Settings />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="avatar">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="user-text">
              <div className="sidebar__user-name">
                {admin?.name || 'Admin'}
              </div>
              <div className="sidebar__user-email">
                {admin?.email || ''}
              </div>
            </div>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
