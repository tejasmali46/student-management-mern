const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
} = require('../controllers/studentController');

// Dashboard statistics (placed before :id route so 'stats' isn't parsed as ObjectId)
router.get('/stats', getStudentStats);

// Main collection routes: GET (all students) and POST (create)
router.route('/')
  .get(getStudents)
  .post(createStudent);

// Single student routes: GET (by ID), PUT (update), DELETE (remove)
router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
