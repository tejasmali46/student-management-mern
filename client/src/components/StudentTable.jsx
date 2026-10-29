import React from 'react';

export default function StudentTable({
  students,
  loading,
  onEdit,
  onDeleteRequest,
  onClearFilters,
}) {
  if (loading) {
    return (
      <div className="card">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Querying students from MongoDB Atlas...</p>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h4>No Students Found</h4>
          <p>No student records match your current search or filter criteria.</p>
          {onClearFilters && (
            <button className="btn btn-secondary btn-sm" onClick={onClearFilters}>
              Reset Search & Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>PRN</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Mobile</th>
              <th style={{ textAlign: 'center', width: '110px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  <span className="prn-code">{student.prn}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                    {student.name}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                <td>
                  <span className="badge badge-dept">{student.department}</span>
                </td>
                <td>
                  <span className="badge badge-year">{student.year}</span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {student.mobile}
                </td>
                <td>
                  <div className="action-buttons" style={{ justifyContent: 'center' }}>
                    <button
                      className="btn-icon edit"
                      onClick={() => onEdit(student)}
                      title={`Edit ${student.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => onDeleteRequest(student)}
                      title={`Delete ${student.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
