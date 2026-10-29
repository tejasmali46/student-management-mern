import React from 'react';

const DEPARTMENTS = [
  'All',
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
];

const YEARS = ['All', 'First Year', 'Second Year', 'Third Year', 'Final Year'];

export default function QueryBar({
  search,
  setSearch,
  department,
  setDepartment,
  year,
  setYear,
  sortBy,
  setSortBy,
  order,
  setOrder,
  onReset,
}) {
  return (
    <div className="query-bar">
      <div className="query-row-top">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name, PRN, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Reset Filter Button */}
        {(search || department !== 'All' || year !== 'All' || sortBy !== 'createdAt' || order !== 'desc') && (
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      <div className="query-row-filters">
        {/* Filter by Department */}
        <div className="filter-group">
          <label>Department:</label>
          <select
            className="filter-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Year */}
        <div className="filter-group">
          <label>Year:</label>
          <select
            className="filter-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {YEARS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Field */}
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="prn">PRN</option>
            <option value="department">Department</option>
            <option value="createdAt">Date Enrolled</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label>Order:</label>
          <select
            className="filter-select"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Ascending (A → Z, 0 → 9)</option>
            <option value="desc">Descending (Z → A, 9 → 0)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
