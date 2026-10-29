import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import QueryBar from './components/QueryBar';
import Pagination from './components/Pagination';
import DeleteModal from './components/DeleteModal';
import Notification from './components/Notification';
import { getStudents, deleteStudent } from './services/api';

export default function App() {
  // Navigation State with URL hash sync
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'students', 'add'].includes(hash)) return hash;
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    window.location.hash = tab;
    setActiveTabState(tab);
  };

  // Sync state if user clicks browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'students', 'add'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Query and Filtering State
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8; // records per page

  // Data State
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Edit and Delete Modals State
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Fetch students from backend REST API
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getStudents({
        search,
        department,
        year,
        sortBy,
        order,
        page: currentPage,
        limit,
      });

      if (res.success) {
        setStudents(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to fetch students from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, department, year, sortBy, order, currentPage, limit]);

  // Load students when query parameters or page change
  useEffect(() => {
    // Reset to page 1 if query filters change (handled inside reset or search change)
    loadStudents();
  }, [loadStudents]);

  // Debounced search reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, year, sortBy, order]);

  // Handle demo state triggers for automated documentation & screenshot verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    if (demo === 'delete' && students.length > 0) {
      setStudentToDelete(students[0]);
    } else if (demo === 'edit' && students.length > 0) {
      setEditingStudent(students[0]);
      setActiveTabState('add');
    } else if (demo === 'filter') {
      setDepartment('Computer Engineering');
      setSortBy('name');
      setOrder('asc');
    }
  }, [students]);

  // Handle Edit Action
  const handleEdit = (student) => {
    setEditingStudent(student);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingStudent(null);
    setActiveTab('students');
  };

  // Handle Create or Update Success
  const handleFormSuccess = () => {
    setEditingStudent(null);
    setActiveTab('students');
    loadStudents();
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setDeleting(true);
      const res = await deleteStudent(studentToDelete._id);
      showNotification(res.message || 'Student deleted successfully', 'success');
      setStudentToDelete(null);
      // Reload students
      loadStudents();
    } catch (err) {
      showNotification(err.message || 'Failed to delete student', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All');
    setYear('All');
    setSortBy('createdAt');
    setOrder('desc');
    setCurrentPage(1);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'add' && editingStudent) {
            setEditingStudent(null);
          }
          setActiveTab(tab);
        }}
        totalCount={total}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onEditStudent={handleEdit}
          />
        )}

        {/* TAB 2: STUDENTS DIRECTORY (VIEW + CRUD + QUERY FEATURES) */}
        {activeTab === 'students' && (
          <div>
            <div className="view-header">
              <div className="view-header-title">
                <h2>Student Records Directory</h2>
                <p>Browse, search, sort, and manage registered student profiles</p>
              </div>
              <button
                className="btn btn-accent"
                onClick={() => {
                  setEditingStudent(null);
                  setActiveTab('add');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Enroll New Student
              </button>
            </div>

            {/* Query Controls: Search, Filters, Sorting */}
            <QueryBar
              search={search}
              setSearch={setSearch}
              department={department}
              setDepartment={setDepartment}
              year={year}
              setYear={setYear}
              sortBy={sortBy}
              setSortBy={setSortBy}
              order={order}
              setOrder={setOrder}
              onReset={handleResetFilters}
            />

            {/* Student Records Table */}
            <StudentTable
              students={students}
              loading={loading}
              onEdit={handleEdit}
              onDeleteRequest={(student) => setStudentToDelete(student)}
              onClearFilters={handleResetFilters}
            />

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

        {/* TAB 3: ADD / EDIT STUDENT FORM */}
        {activeTab === 'add' && (
          <div>
            <div className="view-header">
              <div className="view-header-title">
                <h2>{editingStudent ? 'Update Student Record' : 'Student Enrollment'}</h2>
                <p>
                  {editingStudent
                    ? `Editing details for student PRN: ${editingStudent.prn}`
                    : 'Fill in student credentials to register into MongoDB database'}
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditingStudent(null);
                  setActiveTab('students');
                }}
              >
                ← Back to Directory
              </button>
            </div>

            <StudentForm
              editingStudent={editingStudent}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelEdit}
              showNotification={showNotification}
            />
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        student={studentToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
        deleting={deleting}
      />

      {/* Toast Notification Container */}
      <Notification
        notification={notification}
        onClose={closeNotification}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          <strong>Student Management System</strong> &bull; Web Technology Laboratory (Assignment 7)
        </p>
        <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
          Built with React.js, Node.js, Express.js, and MongoDB Atlas (MERN Stack) &bull; Fetch API Integration
        </p>
      </footer>
    </div>
  );
}
