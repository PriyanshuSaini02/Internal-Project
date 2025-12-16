import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Home = () => {
  const { admin } = useAuth();

  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="panel__title">Hello, {admin?.name || 'Admin'} 👋</h1>
          <p className="panel__subtitle">
            Use the sidebar to navigate between your dashboard and settings.
          </p>
        </div>
      </div>

      <div className="grid">
        <div className="card subtle">
          <h3>Quick actions</h3>
          <ul className="list">
            <li>View team members and projects in Dashboard</li>
            <li>Add or edit users as needed</li>
            <li>Update your password from Settings</li>
          </ul>
        </div>
        <div className="card accent">
          <h3>Tip</h3>
          <p>
            Keep user profiles updated and use profile pictures for quick recognition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

