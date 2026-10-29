# Student Management System (MERN Stack)
### Web Technology Laboratory — Assignment 7

A modern, responsive, full-stack Student Management System built using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) with native **Fetch API** communication, modular REST architecture, input validation, and database-backed querying.

---

## 1. System Overview & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Single Page Application with clean Navy/Slate theme, responsive CSS |
| **Backend** | Node.js & Express.js | Modular REST API with centralized error handling and CORS |
| **Database** | MongoDB Atlas | Cloud NoSQL Document Database (Database: `student_management`, Collection: `students`) |
| **ODM / Driver** | Mongoose 8.x | Schema validation, unique constraints, and aggregation pipelines |
| **Communication** | Fetch API | Asynchronous HTTP requests from React client to Express REST endpoints |

---

## 2. Key Features

### A. Academic Dashboard
- Real-time statistics: Total enrolled students, department count, academic year levels, and database status.
- Departmental distribution percentage visual bars.
- Table of recent student enrollments with direct navigation.

### B. Student Registration (Create)
- Form inputs: Student Name, PRN (Permanent Registration Number), Official Email, Engineering Department, Year of Study, and 10-Digit Mobile Number.
- Comprehensive client-side and server-side validation.
- Duplicate PRN detection preventing duplicate registration (HTTP 409 Conflict).

### C. Student Directory & Details (Read)
- Responsive tabular view of all registered student records with status badges.
- Live empty states and loading spinners.

### D. Record Update (Update)
- Pre-populated edit form with field validation.
- Preserves unique PRN constraints while updating existing records.

### E. Record Deletion (Delete)
- Interactive deletion confirmation dialog displaying the student's name and PRN to prevent accidental loss.
- Immediate UI synchronization.

### F. Query Features (Full MongoDB Integration)
1. **Multi-field Search**: Real-time regex search across student name, PRN, and email.
2. **Multi-attribute Filtering**: Filter by department and academic year.
3. **Multi-column Sorting**: Sort by Name, PRN, Department, or Enrollment Date in Ascending (A-Z) or Descending (Z-A) order.
4. **Pagination**: Configurable limit per page with page indicators, previous/next buttons, and total document counts.

---

## 3. Project Directory Structure

```text
student-management/
├── client/
│   ├── dist/                     # Optimized production bundle
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # Analytics & KPIs
│   │   │   ├── DeleteModal.jsx   # Deletion confirmation dialog
│   │   │   ├── Navbar.jsx        # Navigation header & badges
│   │   │   ├── Notification.jsx  # Toast alert notification
│   │   │   ├── Pagination.jsx    # Page navigation controls
│   │   │   ├── QueryBar.jsx      # Search, filter, and sort controls
│   │   │   ├── StudentForm.jsx   # Add & Edit form with validation
│   │   │   └── StudentTable.jsx  # Student records data table
│   │   ├── services/
│   │   │   └── api.js            # Standard Fetch API client
│   │   ├── App.jsx               # Root React state management
│   │   ├── index.css             # Polished Navy/Slate CSS styling
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & offline fallback
│   ├── controllers/
│   │   └── studentController.js  # Business logic & query handling
│   ├── middleware/
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   └── Student.js            # Mongoose Schema & validation
│   ├── routes/
│   │   └── studentRoutes.js      # REST API route definitions
│   ├── tests/
│   │   └── api.test.js           # 51-point automated verification test suite
│   ├── package.json
│   ├── server.js                 # Express server & static asset handler
│   └── .env.example              # Server environment template
├── screenshots/                  # Authentic application screenshots
├── .env.example                  # Root environment template
├── .gitignore                    # Git ignore file (excludes node_modules & .env)
└── README.md
```

---

## 4. REST API Specification

| HTTP Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Fetch students with search, filter, sort, & pagination | `200 OK` |
| `GET` | `/api/students/stats` | Fetch aggregated dashboard statistics | `200 OK` |
| `GET` | `/api/students/:id` | Fetch single student record by MongoDB ObjectId | `200 OK`, `404 Not Found` |
| `POST` | `/api/students` | Enroll a new student record | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PUT` | `/api/students/:id` | Update an existing student record | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/students/:id` | Permanently remove a student record | `200 OK`, `404 Not Found` |
| `GET` | `/api/health` | Service health status check | `200 OK` |

---

## 5. Local Setup and Installation Guide

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)
- MongoDB Atlas account (or use built-in offline in-memory fallback)

### Step 1: Clone or Extract the Project
```bash
cd student-management
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file in the `server` directory to `.env`:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and update the connection string with your MongoDB Atlas credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_management?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```
*(Note: If no Atlas URI is provided, the server automatically starts an in-memory MongoDB instance with seed data for offline demonstration).*

### Step 3: Install Dependencies
Open two terminal tabs:

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
# Server will run at http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 6. Automated Testing

The project includes an end-to-end automated test suite verifying all 10 core functional groups:
```bash
cd server
npm test
```
The suite verifies:
- Validation rejection for missing fields, bad mobile, and bad email.
- Successful student creation (`POST /api/students`).
- Prevention of duplicate PRNs (`409 Conflict`).
- Retrieval of all records and individual records by ID.
- Updation of student records (`PUT /api/students/:id`).
- Real-time search across name, PRN, and email.
- Departmental and academic year filtering.
- Multi-field sorting (ascending and descending).
- Database-driven pagination (limits, offsets, total pages).
- Dashboard aggregation calculations.
- Deletion and subsequent 404 verification.

---

## 7. Cloud Deployment Guide

### A. MongoDB Atlas Database Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a database user (e.g., `student_admin`) with password.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud connections from Render.
5. In **Database**, click **Connect** → **Drivers** → Copy the Connection String.
6. Append `/student_management` as the database name in the connection string.

### B. Backend Deployment (Render.com)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
5. Click **Deploy Web Service**. Copy the generated live URL (e.g., `https://student-api.onrender.com`).

### C. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Set the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://student-api.onrender.com/api` (Point to your deployed Render backend)
4. Click **Deploy**. Vercel will provide your production URL.

---

## 8. College Practical & Viva Questions

### Q1: What is the MERN stack and how do its layers interact in this project?
> **Answer:** MERN stands for MongoDB (database), Express.js (backend web framework), React.js (frontend user interface), and Node.js (JavaScript runtime). In this project, React makes asynchronous HTTP requests using the browser's Fetch API to Express REST endpoints hosted on Node.js. Express routes the request to controller functions that use Mongoose ODM to query or mutate documents inside MongoDB Atlas. The JSON response is sent back to React, which updates its component state to re-render the UI.

### Q2: Why did you use Mongoose instead of the native MongoDB driver?
> **Answer:** Mongoose provides an Object Data Modeling (ODM) layer on top of MongoDB. It allows us to define rigid schemas with built-in validation (required fields, regex patterns, enum lists), type casting, middleware hooks, and custom business logic, which prevents invalid or malformed data from entering our NoSQL database.

### Q3: How is duplicate PRN prevention implemented?
> **Answer:** It is enforced at two levels:
> 1. **Database Schema Level:** `prn: { type: String, unique: true }` instructs MongoDB to create a unique B-tree index on the `prn` field. If a duplicate is attempted, MongoDB throws an `E11000` duplicate key error.
> 2. **Controller & Middleware Level:** In `studentController.js`, we check `await Student.findOne({ prn })` before inserting to provide a clear, user-friendly 409 Conflict response. Furthermore, `errorMiddleware.js` catches code `11000` and transforms it into a friendly error message.

### Q4: How do search, filter, and pagination work on the backend?
> **Answer:** We build a dynamic MongoDB query object in `studentController.js`:
> - **Search:** We use a case-insensitive regular expression: `query.$or = [{ name: regex }, { prn: regex }, { email: regex }]`.
> - **Filter:** Exact field match: `query.department = department` and `query.year = year`.
> - **Sort:** `Student.find(query).sort({ [sortBy]: order === 'asc' ? 1 : -1 })`.
> - **Pagination:** Using `.skip((page - 1) * limit).limit(limit)`, combined with `Student.countDocuments(query)` to calculate `totalPages`.

### Q5: How are sensitive database credentials protected?
> **Answer:** Credentials are never hardcoded in source code. They are stored in environment variables via `.env` files locally and managed through cloud dashboard configuration panels (Render and Vercel) in production. `.env` is explicitly included in `.gitignore` so secrets are never pushed to GitHub. A template file `.env.example` is provided for configuration reference.

---
*MIT Academy of Engineering (MITAOE) • Department of Computer Engineering • Web Technology (2304362L)*
