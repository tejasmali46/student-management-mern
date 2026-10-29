import React from 'react';

export default function DeleteModal({ student, onConfirm, onCancel, deleting }) {
  if (!student) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <span style={{ color: 'var(--danger)', marginRight: '0.4rem' }}>⚠️</span>
            Confirm Student Deletion
          </h3>
          <button className="btn-icon" onClick={onCancel} title="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to permanently delete the student record for:
          </p>
          <div
            style={{
              margin: '1rem 0',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '4px solid var(--danger)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--primary-navy)', fontSize: '1rem' }}>
              {student.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              PRN: <strong>{student.prn}</strong> • {student.department}
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
            This action cannot be undone. The document will be permanently removed from MongoDB.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting from MongoDB...' : 'Yes, Delete Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
