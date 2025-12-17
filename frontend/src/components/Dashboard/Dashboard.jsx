import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";

import DashboardHeader from "./DashboardHeader";
import SearchBar from "./SearchBar";
import UsersTable from "./UserTable";
import EmptyState from "./EmptyState";

import "./Dashboard.css";

// normalize helper
const normalizeType = (value = "") =>
  value.toLowerCase().replace(/[\s-_]/g, "");

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const [sortConfig, setSortConfig] = useState({
    column: "name",
    direction: "asc",
  });

  // 🔔 toast state
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => setToast({ type, message });

  const { admin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [showDeleted]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = showDeleted
        ? await userAPI.getDeleted()
        : await userAPI.getAll();

      setUsers(res.data.users || []);
    } catch (err) {
      showToast("error", err.response?.data?.msg || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const userName =
      users.find((u) => u.userId === userId)?.name || "this user";

    try {
      await userAPI.delete(userId);
      showToast("success", `"${userName}" deleted successfully`);
      fetchUsers();
    } catch (err) {
      showToast("error", err.response?.data?.msg || "Failed to delete user");
    }
  };

  const handleRestore = async (userId) => {
    const userName =
      users.find((u) => u.userId === userId)?.name || "this user";

    try {
      await userAPI.restore(userId);
      showToast("success", `"${userName}" restored successfully`);
      fetchUsers();
    } catch (err) {
      showToast("error", err.response?.data?.msg || "Failed to restore user");
    }
  };

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  /* ================= FILTERING ================= */

  const filteredUsers = users.filter((user) => {
    const matchesSearch = [user.name, user.email, user.userId, user.type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      normalizeType(user.type) === normalizeType(typeFilter);

    return matchesSearch && matchesType;
  });

  /* ================= SORTING ================= */

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { column, direction } = sortConfig;

    let aVal = a[column] ?? "";
    let bVal = b[column] ?? "";

    if (column === "dob" || column === "doj") {
      aVal = new Date(aVal).getTime() || 0;
      bVal = new Date(bVal).getTime() || 0;
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="dashboard-container">
      <DashboardHeader admin={admin} />

      <div className="dashboard-content">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={fetchUsers}
          loading={loading}
          showDeleted={showDeleted}
          setShowDeleted={setShowDeleted}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        {loading ? (
          <div className="loading">
            <Spinner label="Loading users..." />
          </div>
        ) : sortedUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <UsersTable
            users={sortedUsers}
            onDelete={handleDelete}
            onRestore={handleRestore}
            sortConfig={sortConfig}
            onSort={handleSort}
            showDeleted={showDeleted}
          />
        )}
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

export default Dashboard;
