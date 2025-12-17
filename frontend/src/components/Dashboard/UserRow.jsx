import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, RotateCcw } from "lucide-react";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "N/A";

const getProfileImageUrl = (profilePicture) => {
  if (!profilePicture) return null;
  if (profilePicture.startsWith("http")) return profilePicture;
  return `http://localhost:5000${profilePicture}`;
};

const UserRow = ({ user, onDelete, onRestore, showDeleted }) => {
  const navigate = useNavigate();
  const imageUrl = getProfileImageUrl(user.profilePicture);
  const isDeleted = user.isDeleted;

  return (
    <tr className={isDeleted ? "deleted-row" : ""}>
      <td>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.name}
            className="profile-thumbnail"
            onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
          />
        ) : (
          <div className="profile-placeholder">No Image</div>
        )}
      </td>

      <td>{user.name}</td>
      <td>{user.email.slice(0, 15)}...</td>
      <td>{user.userId}</td>

      <td>
        <span className={`type-badge ${user.type || "unknown"}`}>
          {user.type || "N/A"}
        </span>
      </td>

      <td>{formatDate(user.dob)}</td>
      <td>{formatDate(user.doj)}</td>
      <td>{user.project?.join(", ") || "N/A"}</td>
      <td>{user.phoneNumber || "N/A"}</td>

      {showDeleted && (
        <td>
          <span className={`status-badge ${isDeleted ? "deleted" : "active"}`}>
            {isDeleted ? "Deleted" : "Active"}
          </span>
        </td>
      )}

      <td>
        <div className="action-buttons">
          {isDeleted ? (
            <button
              className="icon-btn restore"
              title="Restore"
              onClick={() => onRestore(user.userId)}
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            <>
              <button
                className="icon-btn view"
                title="View"
                onClick={() => navigate(`/users/${user.userId}`)}
              >
                <Eye size={16} />
              </button>

              <button
                className="icon-btn edit"
                title="Edit"
                onClick={() => navigate(`/users/${user.userId}/edit`)}
              >
                <Pencil size={16} />
              </button>

              <button
                className="icon-btn delete"
                title="Delete"
                onClick={() => onDelete(user.userId)}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
