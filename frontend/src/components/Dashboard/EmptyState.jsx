import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <p>No users found</p>
      <button className="btn-primary" onClick={() => navigate("/users/add")}>
        Add First User
      </button>
    </div>
  );
};

export default EmptyState;
