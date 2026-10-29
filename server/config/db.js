const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas or fallback to local in-memory MongoDB for offline viva demonstration
 */
const connectDB = async () => {
  // If MONGODB_URI is provided in environment variables, connect to it
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>')) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'student_management',
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB] Atlas Connection Error: ${error.message}`);
    }
  }

  // Graceful offline fallback for practical viva & local testing without internet/credentials
  try {
    console.log('[MongoDB] Notice: MONGODB_URI not configured. Launching in-memory MongoDB for offline demonstration...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri, {
      dbName: 'student_management',
    });
    console.log(`[MongoDB] Connected to in-memory database: ${conn.connection.name}`);

    // Seed initial records if empty so the dashboard has rich data
    const Student = require('../models/Student');
    const count = await Student.countDocuments();
    if (count === 0) {
      await Student.insertMany([
        {
          name: 'Aarav Sharma',
          prn: '202401040001',
          email: 'aarav.sharma@mitaoe.ac.in',
          department: 'Computer Engineering',
          year: 'Third Year',
          mobile: '9822012345',
        },
        {
          name: 'Bhavna Patel',
          prn: '202401040002',
          email: 'bhavna.patel@mitaoe.ac.in',
          department: 'Information Technology',
          year: 'Second Year',
          mobile: '9833012345',
        },
        {
          name: 'Chetan Deshmukh',
          prn: '202401040003',
          email: 'chetan.d@mitaoe.ac.in',
          department: 'Computer Engineering',
          year: 'Final Year',
          mobile: '9844012345',
        },
        {
          name: 'Diya Joshi',
          prn: '202401040004',
          email: 'diya.j@mitaoe.ac.in',
          department: 'Electronics & Telecommunication',
          year: 'First Year',
          mobile: '9855012345',
        },
        {
          name: 'Eshaan Kulkarni',
          prn: '202401040005',
          email: 'eshaan.k@mitaoe.ac.in',
          department: 'Mechanical Engineering',
          year: 'Third Year',
          mobile: '9866012345',
        },
        {
          name: 'Fatima Shaikh',
          prn: '202401040006',
          email: 'fatima.s@mitaoe.ac.in',
          department: 'Civil Engineering',
          year: 'Second Year',
          mobile: '9877012345',
        },
      ]);
      console.log('[MongoDB] Seeded 6 initial student records into student_management collection.');
    }

    return conn;
  } catch (err) {
    console.error(`[MongoDB] Fallback initialization error: ${err.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
