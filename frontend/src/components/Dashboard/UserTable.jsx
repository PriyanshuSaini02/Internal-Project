import UserRow from "./UserRow";

const UsersTable = ({ users, onDelete, onRestore, sortConfig, onSort, showDeleted }) => {
  const getSortIndicator = (column) => {
    if (sortConfig.column !== column) {
      return <span className="sort-arrow">⇅</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="sort-arrow active">↑</span>
    ) : (
      <span className="sort-arrow active">↓</span>
    );
  };

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th className="sortable" onClick={() => onSort("name")}>
              Name {getSortIndicator("name")}
            </th>
            <th className="sortable" onClick={() => onSort("email")}>
              Email {getSortIndicator("email")}
            </th>
            <th className="sortable" onClick={() => onSort("userId")}>
              User ID {getSortIndicator("userId")}
            </th>
            <th>
              Type
            </th>
            <th className="sortable" onClick={() => onSort("dob")}>
              DOB {getSortIndicator("dob")}
            </th>
            <th className="sortable" onClick={() => onSort("doj")}>
              DOJ {getSortIndicator("doj")}
            </th>
            <th>Projects</th>
            <th>Phone</th>
            {showDeleted && <th>Status</th>}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <UserRow 
              key={user._id} 
              user={user} 
              onDelete={onDelete}
              onRestore={onRestore}
              showDeleted={showDeleted}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;