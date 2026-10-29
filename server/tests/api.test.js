/**
 * End-to-End API Test Suite for Student Management System
 * Uses Node's native test/assert and MongoMemoryServer
 * Verifies all CRUD operations, validations, queries, sorting, pagination, and error handling.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cors = require('cors');
const studentRoutes = require('../routes/studentRoutes');
const errorHandler = require('../middleware/errorMiddleware');
const Student = require('../models/Student');

// Create test app instance
function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/students', studentRoutes);
  app.use(errorHandler);
  return app;
}

// Helper to make fetch requests to the running test server
let baseUrl = '';

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function runTestSuite() {
  console.log('====================================================');
  console.log(' Starting Student Management System Verification Test');
  console.log('====================================================\n');

  let mongod;
  let server;
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Start MongoDB In-Memory Server
    console.log('[Setup] Launching In-Memory MongoDB Server...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { dbName: 'student_management' });
    console.log('[Setup] Connected to in-memory database:', mongoose.connection.name);

    // 2. Start Express HTTP Server
    const app = createTestApp();
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`[Setup] Express test server listening at: ${baseUrl}\n`);
        resolve();
      });
    });

    // ---------------------------------------------------------
    // TEST 1: Rejecting Invalid Input
    // ---------------------------------------------------------
    console.log('--> Test Group 1: Validation and Duplicate Constraints');
    {
      // Missing fields
      const res1 = await request('/api/students', {
        method: 'POST',
        body: JSON.stringify({ name: 'Only Name' }),
      });
      assert(res1.status === 400, 'POST /api/students returns 400 when required fields are missing');
      assert(res1.data.success === false, 'Response indicates success = false for missing fields');

      // Invalid mobile format
      const res2 = await request('/api/students', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Invalid Mobile Student',
          prn: 'PRN1001',
          email: 'valid@example.com',
          department: 'Computer Engineering',
          year: 'Third Year',
          mobile: '12345', // invalid
        }),
      });
      assert(res2.status === 400, 'POST /api/students rejects invalid mobile number format (must be 10 digits starting 6-9)');

      // Invalid email format
      const res3 = await request('/api/students', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Invalid Email Student',
          prn: 'PRN1002',
          email: 'invalid-email-address',
          department: 'Computer Engineering',
          year: 'Third Year',
          mobile: '9876543210',
        }),
      });
      assert(res3.status === 400, 'POST /api/students rejects invalid email format');
    }

    // ---------------------------------------------------------
    // TEST 2: CREATE - Adding Students
    // ---------------------------------------------------------
    console.log('\n--> Test Group 2: Create (POST /api/students)');
    let studentId1 = '';
    let studentId2 = '';
    {
      const student1 = {
        name: 'Aarav Sharma',
        prn: '202401040001',
        email: 'aarav.sharma@mitaoe.ac.in',
        department: 'Computer Engineering',
        year: 'Third Year',
        mobile: '9822012345',
      };

      const res = await request('/api/students', {
        method: 'POST',
        body: JSON.stringify(student1),
      });

      assert(res.status === 201, 'POST /api/students returns 201 Created');
      assert(res.data.success === true, 'Response returns success = true');
      assert(res.data.data.name === 'Aarav Sharma', 'Student name saved accurately');
      assert(res.data.data.prn === '202401040001', 'PRN stored accurately in uppercase');
      studentId1 = res.data.data._id;

      // Add a second student
      const student2 = {
        name: 'Bhavna Patel',
        prn: '202401040002',
        email: 'bhavna.patel@mitaoe.ac.in',
        department: 'Information Technology',
        year: 'Second Year',
        mobile: '9833012345',
      };
      const res2 = await request('/api/students', {
        method: 'POST',
        body: JSON.stringify(student2),
      });
      assert(res2.status === 201, 'Second student created successfully');
      studentId2 = res2.data.data._id;

      // Add additional students for query tests
      const extraStudents = [
        { name: 'Chetan Deshmukh', prn: '202401040003', email: 'chetan.d@mitaoe.ac.in', department: 'Computer Engineering', year: 'Final Year', mobile: '9844012345' },
        { name: 'Diya Joshi', prn: '202401040004', email: 'diya.j@mitaoe.ac.in', department: 'Electronics & Telecommunication', year: 'First Year', mobile: '9855012345' },
        { name: 'Eshaan Kulkarni', prn: '202401040005', email: 'eshaan.k@mitaoe.ac.in', department: 'Mechanical Engineering', year: 'Third Year', mobile: '9866012345' },
        { name: 'Fatima Shaikh', prn: '202401040006', email: 'fatima.s@mitaoe.ac.in', department: 'Computer Engineering', year: 'Second Year', mobile: '9877012345' },
      ];
      for (const s of extraStudents) {
        await request('/api/students', { method: 'POST', body: JSON.stringify(s) });
      }
    }

    // ---------------------------------------------------------
    // TEST 3: Preventing Duplicate PRNs
    // ---------------------------------------------------------
    console.log('\n--> Test Group 3: Duplicate PRN Prevention');
    {
      const duplicateStudent = {
        name: 'Duplicate PRN Holder',
        prn: '202401040001', // same PRN as Aarav Sharma
        email: 'duplicate@mitaoe.ac.in',
        department: 'Civil Engineering',
        year: 'First Year',
        mobile: '9899012345',
      };

      const res = await request('/api/students', {
        method: 'POST',
        body: JSON.stringify(duplicateStudent),
      });

      assert(res.status === 409, 'POST /api/students returns 409 Conflict when duplicate PRN is provided');
      assert(res.data.success === false, 'Duplicate response explicitly denotes success = false');
      assert(res.data.message.includes('already exists') || res.data.message.includes('already registered'), 'Duplicate response message explains the conflict clearly');
    }

    // ---------------------------------------------------------
    // TEST 4: READ - Fetch Students & Details
    // ---------------------------------------------------------
    console.log('\n--> Test Group 4: Read (GET /api/students & GET /api/students/:id)');
    {
      const res = await request('/api/students');
      assert(res.status === 200, 'GET /api/students returns 200 OK');
      assert(res.data.success === true, 'Response contains success = true');
      assert(res.data.total === 6, 'Total count matches 6 registered students');
      assert(Array.isArray(res.data.data), 'Returns an array of student documents');

      // Fetch single student by ID
      const singleRes = await request(`/api/students/${studentId1}`);
      assert(singleRes.status === 200, 'GET /api/students/:id returns 200 OK');
      assert(singleRes.data.data.name === 'Aarav Sharma', 'Single student fetch returns accurate document');
      assert(singleRes.data.data.prn === '202401040001', 'Single student fetch PRN matches');
    }

    // ---------------------------------------------------------
    // TEST 5: UPDATE - Edit Student
    // ---------------------------------------------------------
    console.log('\n--> Test Group 5: Update (PUT /api/students/:id)');
    {
      const updatePayload = {
        name: 'Aarav S. Sharma (Honors)',
        prn: '202401040001',
        email: 'aarav.sharma.honors@mitaoe.ac.in',
        department: 'Computer Engineering',
        year: 'Final Year', // Promoted to Final Year
        mobile: '9822099999',
      };

      const res = await request(`/api/students/${studentId1}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      assert(res.status === 200, 'PUT /api/students/:id returns 200 OK');
      assert(res.data.data.name === 'Aarav S. Sharma (Honors)', 'Updated student name reflected in DB');
      assert(res.data.data.year === 'Final Year', 'Updated academic year reflected in DB');
      assert(res.data.data.email === 'aarav.sharma.honors@mitaoe.ac.in', 'Updated email reflected in DB');
    }

    // ---------------------------------------------------------
    // TEST 6: QUERY FEATURES - Search & Filter
    // ---------------------------------------------------------
    console.log('\n--> Test Group 6: Query Features (Search & Filter)');
    {
      // 1. Search by name
      const searchRes = await request('/api/students?search=Bhavna');
      assert(searchRes.status === 200, 'Search query executed successfully');
      assert(searchRes.data.data.length === 1, 'Search found exactly 1 match for "Bhavna"');
      assert(searchRes.data.data[0].name === 'Bhavna Patel', 'Search returned correct student');

      // 2. Search by PRN
      const prnSearchRes = await request('/api/students?search=202401040004');
      assert(prnSearchRes.data.data.length === 1, 'Search found 1 match for PRN "202401040004"');
      assert(prnSearchRes.data.data[0].name === 'Diya Joshi', 'Search by PRN returned correct student');

      // 3. Filter by department
      const deptRes = await request('/api/students?department=Computer%20Engineering');
      assert(deptRes.status === 200, 'Filter by department executed');
      assert(deptRes.data.data.length === 3, 'Filter by Computer Engineering returned 3 matching students');

      // 4. Filter by year
      const yearRes = await request('/api/students?year=Second%20Year');
      assert(yearRes.status === 200, 'Filter by year executed');
      assert(yearRes.data.data.length === 2, 'Filter by Second Year returned 2 matching students');
    }

    // ---------------------------------------------------------
    // TEST 7: QUERY FEATURES - Sorting & Pagination
    // ---------------------------------------------------------
    console.log('\n--> Test Group 7: Query Features (Sorting & Pagination)');
    {
      // 1. Sort by name ascending
      const sortAscRes = await request('/api/students?sortBy=name&order=asc&limit=10');
      assert(sortAscRes.status === 200, 'Sort by name ascending returned 200');
      assert(sortAscRes.data.data[0].name.startsWith('Aarav'), 'First student is Aarav in alphabetical asc sort');

      // 2. Sort by name descending
      const sortDescRes = await request('/api/students?sortBy=name&order=desc&limit=10');
      assert(sortDescRes.data.data[0].name.startsWith('Fatima'), 'First student is Fatima in alphabetical desc sort');

      // 3. Pagination: page 1 with limit 2
      const page1Res = await request('/api/students?page=1&limit=2');
      assert(page1Res.data.currentPage === 1, 'Pagination page = 1 confirmed');
      assert(page1Res.data.limit === 2, 'Pagination limit = 2 confirmed');
      assert(page1Res.data.data.length === 2, 'Page 1 returned exactly 2 records');
      assert(page1Res.data.totalPages === 3, 'Total pages calculated as 3 (6 students / 2 per page)');

      // 4. Pagination: page 2
      const page2Res = await request('/api/students?page=2&limit=2');
      assert(page2Res.data.currentPage === 2, 'Page 2 returned correctly');
      assert(page2Res.data.data.length === 2, 'Page 2 returned exactly 2 records');
    }

    // ---------------------------------------------------------
    // TEST 8: Dashboard Analytics API
    // ---------------------------------------------------------
    console.log('\n--> Test Group 8: Dashboard Analytics (/api/students/stats)');
    {
      const statsRes = await request('/api/students/stats');
      assert(statsRes.status === 200, 'GET /api/students/stats returns 200 OK');
      assert(statsRes.data.data.totalStudents === 6, 'Dashboard reports accurate total students (6)');
      assert(Array.isArray(statsRes.data.data.deptStats), 'Dashboard returns departmental aggregation');
      assert(Array.isArray(statsRes.data.data.recentStudents), 'Dashboard returns recent students list');
    }

    // ---------------------------------------------------------
    // TEST 9: DELETE - Remove Student & Confirm 404
    // ---------------------------------------------------------
    console.log('\n--> Test Group 9: Delete (DELETE /api/students/:id)');
    {
      const delRes = await request(`/api/students/${studentId2}`, {
        method: 'DELETE',
      });
      assert(delRes.status === 200, 'DELETE /api/students/:id returns 200 OK');
      assert(delRes.data.success === true, 'Delete response confirms success = true');

      // Verify deletion in MongoDB
      const checkRes = await request(`/api/students/${studentId2}`);
      assert(checkRes.status === 404, 'GET /api/students/:id returns 404 Not Found after deletion');

      // Verify total count decreased
      const countRes = await request('/api/students');
      assert(countRes.data.total === 5, 'Total student count decremented from 6 to 5');
    }

    // ---------------------------------------------------------
    // TEST 10: Error Handling & Invalid Routes
    // ---------------------------------------------------------
    console.log('\n--> Test Group 10: Error Handling & Edge Cases');
    {
      // Invalid ObjectId
      const invalidIdRes = await request('/api/students/invalid-object-id-12345');
      assert(invalidIdRes.status === 404, 'Invalid MongoDB ObjectId handled gracefully with 404');

      // Non-existent endpoint
      const notFoundRes = await request('/api/non-existent-route');
      assert(notFoundRes.status === 404, 'Non-existent route handled with 404');
    }

  } catch (error) {
    console.error('[FATAL ERROR IN TEST SUITE]', error);
    failed++;
  } finally {
    console.log('\n[Teardown] Cleaning up servers and database...');
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  }

  console.log('\n====================================================');
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
