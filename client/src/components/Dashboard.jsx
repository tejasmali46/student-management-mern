import React, { useEffect, useState } from 'react';
import { getStudentStats } from '../services/api';

export default function Dashboard({ setActiveTab, onEditStudent }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudentStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: 'var(--danger)' }}>⚠️</div>
          <h4>Connection Notice</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchStats}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const total = stats?.totalStudents || 0;
  const deptList = stats?.deptStats || [];
  const yearList = stats?.yearStats || [];
  const recentList = stats?.recentStudents || [];

  return (
    <div>
      {/* Header Banner */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Academic Operations Dashboard</h2>
          <p>Real-time analytics and student enrollment overview</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('students')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            View Directory
          </button>
          <button className="btn btn-accent" onClick={() => setActiveTab('add')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Registration
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Enrolled</h3>
            <div className="stat-number">{total}</div>
            <div className="stat-subtext">Active student records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon navy">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Departments</h3>
            <div className="stat-number">{deptList.length}</div>
            <div className="stat-subtext">Active engineering streams</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Database Status</h3>
            <div className="stat-number" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>Connected</div>
            <div className="stat-subtext">MongoDB Atlas Cluster</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Academic Years</h3>
            <div className="stat-number">{yearList.length || 4}</div>
            <div className="stat-subtext">First to Final Year</div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Recent Registrations */}
      <div className="dashboard-grid">
        {/* Recent Registrations Card */}
        <div className="card">
          <div className="card-header">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
              Recently Enrolled Students
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('students')}>
              View All
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentList.length === 0 ? (
              <div className="empty-state">
                <p>No student records yet. Start by enrolling a student.</p>
                <button className="btn btn-accent btn-sm" onClick={() => setActiveTab('add')}>
                  Add First Student
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PRN</th>
                      <th>Student Name</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentList.map((st) => (
                      <tr key={st._id}>
                        <td><span className="prn-code">{st.prn}</span></td>
                        <td style={{ fontWeight: 600 }}>{st.name}</td>
                        <td><span className="badge badge-dept">{st.department}</span></td>
                        <td><span className="badge badge-year">{st.year}</span></td>
                        <td style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>
                          {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
              Department Distribution
            </h3>
          </div>
          <div className="card-body">
            {deptList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No departmental data available yet.</p>
            ) : (
              <div className="breakdown-list">
                {deptList.map((dept) => {
                  const percent = total > 0 ? Math.round((dept.count / total) * 100) : 0;
                  return (
                    <div className="breakdown-item" key={dept._id}>
                      <div className="breakdown-labels">
                        <span style={{ color: 'var(--primary-navy)' }}>{dept._id}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          <strong>{dept.count}</strong> ({percent}%)
                        </span>
                      </div>
                      <div className="breakdown-bar-bg">
                        <div
                          className="breakdown-bar-fill"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
