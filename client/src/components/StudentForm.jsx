import React, { useState, useEffect } from 'react';
import { createStudent, updateStudent } from '../services/api';

const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
];

const YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Final Year',
];

export default function StudentForm({
  editingStudent,
  onSuccess,
  onCancel,
  showNotification,
}) {
  const isEditing = Boolean(editingStudent);

  const initialFormState = {
    name: '',
    prn: '',
    email: '',
    department: '',
    year: '',
    mobile: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        prn: editingStudent.prn || '',
        email: editingStudent.email || '',
        department: editingStudent.department || '',
        year: editingStudent.year || '',
        mobile: editingStudent.mobile || '',
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
    }
  }, [editingStudent]);

  // Client-side validation function
  const validateField = (name, value) => {
    let error = '';
    const trimmed = typeof value === 'string' ? value.trim() : value;

    switch (name) {
      case 'name':
        if (!trimmed) {
          error = 'Student name is required';
        } else if (trimmed.length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s.]+$/.test(trimmed)) {
          error = 'Name should only contain letters and spaces';
        }
        break;

      case 'prn':
        if (!trimmed) {
          error = 'PRN is required';
        } else if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
          error = 'PRN must be alphanumeric without spaces';
        } else if (trimmed.length < 5 || trimmed.length > 20) {
          error = 'PRN should be between 5 and 20 characters';
        }
        break;

      case 'email':
        if (!trimmed) {
          error = 'Email address is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'department':
        if (!trimmed) {
          error = 'Please select a department';
        }
        break;

      case 'year':
        if (!trimmed) {
          error = 'Please select year of study';
        }
        break;

      case 'mobile':
        if (!trimmed) {
          error = 'Mobile number is required';
        } else if (!/^[6-9]\d{9}$/.test(trimmed)) {
          error = 'Enter a valid 10-digit mobile number (starts with 6-9)';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'prn' ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Live validation error clear
    const fieldError = validateField(name, formattedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      showNotification('Please correct the validation errors in the form.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        prn: formData.prn.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        department: formData.department,
        year: formData.year,
        mobile: formData.mobile.trim(),
      };

      if (isEditing) {
        await updateStudent(editingStudent._id, payload);
        showNotification(`Student "${payload.name}" updated successfully!`, 'success');
      } else {
        await createStudent(payload);
        showNotification(`Student "${payload.name}" registered successfully!`, 'success');
        setFormData(initialFormState);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      showNotification(err.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isEditing ? (
                <>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </>
              ) : (
                <>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </>
              )}
            </svg>
            {isEditing ? `Edit Student Details (${editingStudent.prn})` : 'New Student Registration Form'}
          </h3>
          {isEditing && (
            <button className="btn btn-secondary btn-sm" onClick={onCancel}>
              Cancel Edit
            </button>
          )}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group full-width">
                <label className="form-label">
                  Full Student Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Atharva Kulkarni"
                  className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                {errors.name ? (
                  <span className="form-error">{errors.name}</span>
                ) : (
                  <span className="form-helper">Enter student's official registered name</span>
                )}
              </div>

              {/* PRN */}
              <div className="form-group">
                <label className="form-label">
                  Permanent Registration Number (PRN) <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="prn"
                  value={formData.prn}
                  onChange={handleChange}
                  placeholder="e.g. 202401040083"
                  className={`form-input ${errors.prn ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                {errors.prn ? (
                  <span className="form-error">{errors.prn}</span>
                ) : (
                  <span className="form-helper">Unique institute registration ID</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  Official Email Address <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. atharva.k@mitaoe.ac.in"
                  className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                {errors.email ? (
                  <span className="form-error">{errors.email}</span>
                ) : (
                  <span className="form-helper">Valid email for communications</span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Engineering Department <span className="required-star">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="form-error">{errors.department}</span>
                )}
              </div>

              {/* Year of Study */}
              <div className="form-group">
                <label className="form-label">
                  Year of Study <span className="required-star">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`form-select ${errors.year ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Select Academic Year --</option>
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                {errors.year && <span className="form-error">{errors.year}</span>}
              </div>

              {/* Mobile Number */}
              <div className="form-group full-width">
                <label className="form-label">
                  Mobile Number (10 digits) <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className={`form-input ${errors.mobile ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                {errors.mobile ? (
                  <span className="form-error">{errors.mobile}</span>
                ) : (
                  <span className="form-helper">10-digit Indian contact number without country code</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              {!isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={submitting}
                >
                  Clear Form
                </button>
              )}
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn btn-accent"
                disabled={submitting}
              >
                {submitting ? (
                  <span>Saving to MongoDB...</span>
                ) : isEditing ? (
                  'Update Student Record'
                ) : (
                  'Save & Register Student'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
