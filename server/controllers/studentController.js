const Student = require('../models/Student');

/**
 * @desc    Fetch all students with search, filter, sort, and pagination
 * @route   GET /api/students
 * @access  Public
 */
const getStudents = async (req, res, next) => {
  try {
    const {
      search,
      department,
      year,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build query filter
    const query = {};

    // 1. Search across name, PRN, and email
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { prn: searchRegex },
        { email: searchRegex },
      ];
    }

    // 2. Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // 3. Filter by year
    if (year && year !== 'All') {
      query.year = year;
    }

    // Determine pagination options
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting: map 'asc'/'desc' to 1/-1
    const sortDirection = order.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = {};
    const allowedSortFields = ['name', 'prn', 'department', 'year', 'createdAt'];
    const safeSortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[safeSortField] = sortDirection;

    // Execute query with count
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch a single student by ID
 * @route   GET /api/students/:id
 * @access  Public
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, prn, email, department, year, mobile } = req.body;

    // Check if PRN already exists to return friendly message before Mongo duplicate error
    if (prn) {
      const existingStudent = await Student.findOne({
        prn: prn.trim().toUpperCase(),
      });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: `A student with PRN "${prn.trim().toUpperCase()}" is already registered.`,
        });
      }
    }

    const student = await Student.create({
      name,
      prn,
      email,
      department,
      year,
      mobile,
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing student
 * @route   PUT /api/students/:id
 * @access  Public
 */
const updateStudent = async (req, res, next) => {
  try {
    const { name, prn, email, department, year, mobile } = req.body;

    // Check if student exists
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with id: ${req.params.id}`,
      });
    }

    // If PRN is being updated, verify it doesn't conflict with another student
    if (prn && prn.trim().toUpperCase() !== student.prn) {
      const duplicatePRN = await Student.findOne({
        prn: prn.trim().toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (duplicatePRN) {
        return res.status(409).json({
          success: false,
          message: `A student with PRN "${prn.trim().toUpperCase()}" already exists.`,
        });
      }
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        prn: prn ? prn.trim().toUpperCase() : student.prn,
        email,
        department,
        year,
        mobile,
      },
      {
        new: true, // return updated document
        runValidators: true, // enforce schema validation on updates
      }
    );

    res.status(200).json({
      success: true,
      message: 'Student details updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a student record
 * @route   DELETE /api/students/:id
 * @access  Public
 */
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with id: ${req.params.id}`,
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Student "${student.name}" (PRN: ${student.prn}) deleted successfully`,
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/students/stats
 * @access  Public
 */
const getStudentStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();

    // Department breakdown aggregation
    const deptStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Year breakdown aggregation
    const yearStats = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Recent 5 students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name prn department year createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        deptStats,
        yearStats,
        recentStudents,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
};
