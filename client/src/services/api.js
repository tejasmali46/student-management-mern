/**
 * API Service for Student Management System
 * Uses standard Fetch API to communicate with Express REST backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to handle fetch responses and error messages
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch students with search, filters, sorting, and pagination
 */
export async function getStudents(params = {}) {
  const query = new URLSearchParams();

  if (params.search && params.search.trim()) {
    query.append('search', params.search.trim());
  }
  if (params.department && params.department !== 'All') {
    query.append('department', params.department);
  }
  if (params.year && params.year !== 'All') {
    query.append('year', params.year);
  }
  if (params.sortBy) {
    query.append('sortBy', params.sortBy);
  }
  if (params.order) {
    query.append('order', params.order);
  }
  if (params.page) {
    query.append('page', params.page);
  }
  if (params.limit) {
    query.append('limit', params.limit);
  }

  const url = `${BASE_URL}/students?${query.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Fetch dashboard overview statistics
 */
export async function getStudentStats() {
  const response = await fetch(`${BASE_URL}/students/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Fetch a single student by ID
 */
export async function getStudentById(id) {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Create a new student (POST)
 */
export async function createStudent(studentData) {
  const response = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  return handleResponse(response);
}

/**
 * Update an existing student (PUT)
 */
export async function updateStudent(id, studentData) {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  return handleResponse(response);
}

/**
 * Delete a student by ID (DELETE)
 */
export async function deleteStudent(id) {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}
