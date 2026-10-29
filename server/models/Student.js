const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    prn: {
      type: String,
      required: [true, 'PRN is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Za-z0-9]+$/, 'PRN must contain alphanumeric characters only'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: [
          'Computer Engineering',
          'Information Technology',
          'Electronics & Telecommunication',
          'Mechanical Engineering',
          'Civil Engineering',
          'Chemical Engineering',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      enum: {
        values: ['First Year', 'Second Year', 'Third Year', 'Final Year'],
        message: '{VALUE} is not a valid year of study',
      },
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    collection: 'students', // Explicitly specify collection name
  }
);

// Create compound index or text index for fast search
studentSchema.index({ name: 'text', prn: 'text', email: 'text' });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
