import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ admin }) => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div>
        <h1>User Management Dashboard</h1>
        <p>Welcome, {admin?.name}</p>
      </div>

      <button className="btn-secondary" onClick={() => navigate("/users/add")}>
        + Add User
      </button>
    </header>
  );
};

export default DashboardHeader;
