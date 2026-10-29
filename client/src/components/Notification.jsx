import React, { useEffect } from 'react';

export default function Notification({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className="notification-container">
      <div className={`toast ${isSuccess ? 'toast-success' : 'toast-error'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span>{isSuccess ? '✅' : '⚠️'}</span>
          <span>{notification.message}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: 'inherit',
            opacity: 0.7,
            padding: '0 0.25rem',
          }}
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
