const SearchBar = ({
  searchTerm,
  setSearchTerm,
  onRefresh,
  loading,
  showDeleted,
  setShowDeleted,
  typeFilter,
  setTypeFilter,
}) => {
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users by name, email, ID, or type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <button
          className="btn-secondary ghost"
          onClick={clearSearch}
          title="Clear search"
        >
          ✕
        </button>
      )}

      <select
        className="type-filter-dropdown"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="fulltime">Full-Time</option>
        <option value="parttime">Part-Time</option>
        <option value="contract">Contract</option>
        <option value="intern">Intern</option>
      </select>

      <label className="checkbox-inline">
        <input
          type="checkbox"
          checked={showDeleted}
          onChange={(e) => setShowDeleted(e.target.checked)}
        />
        Show Deleted
      </label>

      <button
        className="btn-secondary ghost"
        onClick={onRefresh}
        disabled={loading}
      >
        Refresh
      </button>
    </div>
  );
};

export default SearchBar;
