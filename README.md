# StudyNotion: A Complete MERN Ed-Tech Platform

StudyNotion is a fully functional, highly interactive, and responsive Ed-Tech platform designed to enable instructors to create, manage, and publish educational courses, while allowing students to search for, purchase, consume, and rate those courses.

---

## 🏗️ System Architecture

StudyNotion is built on a decoupled client-server architecture using the MERN stack:
* **Frontend**: React.js SPA, styled with Tailwind CSS, with global state managed via Redux Toolkit.
* **Backend**: Node.js & Express.js REST API server handling request validation, routing, and controller execution.
* **Database**: MongoDB serving persistent data, using Mongoose for schema modeling and relationship handling.

```mermaid
graph TD
    subgraph Client-Side (React Client)
        Client[React.js SPA - Port 3000]
        Redux[Redux Toolkit Store]
        Client --- Redux
    end

    subgraph Server-Side (Express API Server)
        API[Express.js App - Port 4000]
        Middlewares[Auth & Role-Based Middlewares]
        Controllers[API Business Logic Controllers]
        
        API --> Middlewares
        Middlewares --> Controllers
    end

    subgraph External Systems & Cloud Integrations
        DB[(MongoDB Database)]
        Cloudinary[Cloudinary Media Storage]
        Razorpay[Razorpay Payment API]
        SMTP[SMTP Email Gateway - Nodemailer]
    end

    Client ==>|HTTP Requests / JSON| API
    Controllers --->|CRUD Operations| DB
    Controllers --->|Upload Video Lectures / Thumbnails| Cloudinary
    Controllers --->|Payment Orders & Signatures| Razorpay
    Controllers --->|Email Verification & Receipts| SMTP
```

---

## 📁 Repository Directory Structure

```text
StudyNotion-EdTech-Platform-main/
│
├── public/                             # Public static assets for React client
├── src/                                # Frontend React application source code
│   ├── assets/                         # Local images, icons, and logos
│   ├── components/                     # Reusable React components
│   │   ├── Common/                     # Shared components (Navbar, Footer, ConfirmationModal)
│   │   └── core/                       # Page-specific components
│   │       ├── Auth/                   # Login/Signup forms, route handlers
│   │       ├── Catalog/                # Catalog categories, Course Cards, sliders
│   │       ├── ContactUsPage/          # Contact us form details
│   │       ├── Course/                 # Course details cards, accordions
│   │       ├── Dashboard/              # Dashboard sidebars, charts, AddCourse wizard
│   │       └── ViewCourse/             # Video lecture players, progress checklists
│   ├── data/                           # Layout metadata & constants
│   ├── hooks/                          # Custom React Hooks
│   ├── pages/                          # Page views (Home, About, Dashboard, ViewCourse, etc.)
│   ├── reducer/                        # Combined Redux reducers configuration
│   ├── services/                       # API integration services (axios wrapper calls)
│   ├── slices/                         # Redux slices (auth, cart, course, profile, viewCourse)
│   ├── utils/                          # Frontend helpers
│   ├── App.jsx                         # Main Router configuration
│   └── index.js                        # Client mounting script
│
├── server/                             # Backend Node/Express API server source code
│   ├── config/                         # Database, Cloudinary, and Razorpay client initializations
│   ├── controllers/                    # Core business logic handlers (Auth, Course, Profile, Payments)
│   ├── mail/                           # HTML email templates (OTP, Course Registration, Receipts)
│   ├── middleware/                     # Authentication & role verification middlewares
│   ├── models/                         # Mongoose Data Schemas (User, Course, Profile, Category, etc.)
│   ├── routes/                         # API route endpoints mappings
│   ├── utils/                          # Server helper utilities (Nodemailer handler)
│   └── index.js                        # Server entry point
│
├── .env.sample                         # Sample client environment settings
├── .gitignore                          # Project-level git ignore rules
└── package.json                        # Frontend packages and custom startup commands
```

---

## 🗄️ Database Schemas & Data Models

The database comprises 9 primary collections modeled using Mongoose:

1. **User**: Stores login credentials (`email`, `password`), user status, references to enrolled courses, course progress trackers, and references to profile information.
2. **Profile**: Holds secondary demographic information (`gender`, `dateOfBirth`, `about`, `contactNumber`).
3. **Course**: Contains course name, price, tag matrix, categories, instructor ID, status (`Draft` or `Published`), outline sections list, rating reviews, and student enrollees registry.
4. **Section**: Contains section name and references to child Subsections.
5. **Subsection**: Contains lecture title, description, duration, and the Cloudinary URL to the video file.
6. **Category**: Organizes courses under specific subject filters (e.g., Web Development, Finance).
7. **RatingAndReview**: Stores student rating integers (1–5) and review text linked to a specific user and course.
8. **OTP**: Stores temporary 6-digit verification codes with automatic expiration indices (Time-To-Live of 5 minutes).
9. **CourseProgress**: Tracks completed lectures list (`completedVideos` subsection array) against specific courses for individual students.

---

## 🔌 API Route & Middleware Reference

All API routes are prefixed with `/api/v1` and protected by server-side middlewares (located at [server/middleware/auth.js](file:///C:/DOT%20Course%20by%20Love%20Babbar/NOTES/StudyNotion-EdTech-Platform-main/StudyNotion-EdTech-Platform-main/server/middleware/auth.js)).

### Middlewares
* **`auth`**: Validates the JWT token from cookies, headers (`Authorization: Bearer <token>`), or request body. Saves the decoded payload (`req.user`) in the request.
* **`isStudent`**: Checks the user database to confirm their `accountType` is `Student`.
* **`isInstructor`**: Checks the user database to confirm their `accountType` is `Instructor`.
* **`isAdmin`**: Checks the user database to confirm their `accountType` is `Admin`.

---

### Route Endpoints List

| Endpoint | HTTP Method | Middleware | Description |
| :--- | :--- | :--- | :--- |
| **Authentication (`/api/v1/auth`)** | | | |
| `/sendotp` | POST | None | Dispatches validation OTP to student/instructor email. |
| `/signup` | POST | None | Creates a new user profile after validating OTP. |
| `/login` | POST | None | Authenticates password and signs JWT payload token. |
| `/changepassword` | POST | `auth` | Updates password string for logged-in user. |
| `/reset-password-token` | POST | None | Generates reset URL token link and sends password recovery email. |
| `/reset-password` | POST | None | Verifies token and changes database password string. |
| **Course Management (`/api/v1/course`)** | | | |
| `/createCourse` | POST | `auth` + `isInstructor` | Adds draft course details. |
| `/editCourse` | POST | `auth` + `isInstructor` | Modifies course details, category, or status. |
| `/deleteCourse` | DELETE | `auth` + `isInstructor` | Removes course database schema records. |
| `/addSection` | POST | `auth` + `isInstructor` | Adds course outline section category. |
| `/updateSection` | POST | `auth` + `isInstructor` | Renames section category labels. |
| `/deleteSection` | POST | `auth` + `isInstructor` | Removes section and its child subsections. |
| `/addSubSection` | POST | `auth` + `isInstructor` | Uploads video file to Cloudinary and saves Subsection details. |
| `/updateSubSection` | POST | `auth` + `isInstructor` | Re-uploads/edits video or details. |
| `/deleteSubSection` | POST | `auth` + `isInstructor` | Removes subsection record and details. |
| `/getInstructorCourses` | GET | `auth` + `isInstructor` | Fetches all courses created by the logged-in instructor. |
| `/getAllCourses` | GET | None | Fetches all published courses. |
| `/getCourseDetails` | POST | None | Fetches public details for a course. |
| `/getFullCourseDetails` | POST | `auth` | Fetches details and student progress indicators. |
| `/updateCourseProgress` | POST | `auth` + `isStudent` | Checks off completed lectures from tracking array. |
| `/createCategory` | POST | `auth` + `isAdmin` | Generates a new catalog filtering bucket. |
| `/showAllCategories` | GET | None | Lists all catalog categories. |
| `/getCategoryPageDetails` | POST | None | Returns category course lists and bestselling alternatives. |
| `/createRating` | POST | `auth` + `isStudent` | Registers course rating and comment review. |
| `/getAverageRating` | GET | None | Aggregates reviews to return average rating. |
| `/getReviews` | GET | None | Lists reviews globally. |
| **Profile Management (`/api/v1/profile`)** | | | |
| `/updateProfile` | PUT | `auth` | Sets demographic details in profile schema. |
| `/deleteProfile` | DELETE | `auth` | Schedules account/data deletion. |
| `/getUserDetails` | GET | `auth` | Fetches full authenticated user info object. |
| `/getEnrolledCourses` | GET | `auth` | Returns enrolled courses list for student. |
| `/updateDisplayPicture` | PUT | `auth` | Uploads image and updates user's display icon. |
| `/instructorDashboard` | GET | `auth` + `isInstructor` | Aggregates income and enrollment stats. |
| **Payments Integration (`/api/v1/payment`)** | | | |
| `/capturePayment` | POST | `auth` + `isStudent` | Connects with Razorpay API to generate an Order ID. |
| `/verifyPayment` | POST | `auth` + `isStudent` | Validates HMAC-SHA256 verification signature to enroll student. |
| `/sendPaymentSuccessEmail` | POST | `auth` + `isStudent` | Sends email receipt for purchase. |
| **Contact Us (`/api/v1/reach`)** | | | |
| `/contact` | POST | None | Receives contact query message and emails a confirmation copy. |

---

## 🖥️ Frontend Navigation & Routing Map

React application routing is defined in [src/App.jsx](file:///C:/DOT%20Course%20by%20Love%20Babbar/NOTES/StudyNotion-EdTech-Platform-main/StudyNotion-EdTech-Platform-main/src/App.jsx).

### Route Mappings

| Route Path | Component | Permission Type | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | Public | Welcome landing page with interactive CTA links. |
| `/about` | `About` | Public | Platform overview, mission statement, and statistics. |
| `/contact` | `Contact` | Public | Contact query submission form. |
| `/courses/:courseId` | `CourseDetails` | Public | Detailed view of the syllabus, pricing, and reviews. |
| `/catalog/:catalogName` | `Catalog` | Public | Category listings (Popular, New, and Bestseller courses). |
| `/login` | `Login` | Guest Only (`OpenRoute`) | Login portal. Redirects to dashboard if logged in. |
| `/signup` | `Signup` | Guest Only (`OpenRoute`) | Sign up portal. |
| `/verify-email` | `VerifyEmail` | Guest Only (`OpenRoute`) | OTP validation screen to finalize signup. |
| `/forgot-password` | `ForgotPassword` | Guest Only (`OpenRoute`) | Request password recovery email. |
| `/update-password/:id` | `UpdatePassword` | Guest Only (`OpenRoute`) | Recovery form page. |
| `/dashboard/my-profile` | `MyProfile` | Private (`PrivateRoute`) | Shared user summary page. |
| `/dashboard/settings` | `Settings` | Private (`PrivateRoute`) | Manage personal data, display picture, and passwords. |
| `/dashboard/instructor` | `Instructor` | Private + Instructor | Instructor sales, income charts, and course metrics. |
| `/dashboard/my-courses` | `MyCourses` | Private + Instructor | Instructor course list with edit/delete options. |
| `/dashboard/add-course` | `AddCourse` | Private + Instructor | Multi-step course creation wizard. |
| `/dashboard/edit-course/:courseId` | `EditCourse` | Private + Instructor | Modify existing course outline and videos. |
| `/dashboard/enrolled-courses` | `EnrolledCourses` | Private + Student | List of courses student is enrolled in. |
| `/dashboard/cart` | `Cart` | Private + Student | Cart checkout and total calculations. |
| `/view-course/:courseId/...` | `VideoDetails` | Private + Student | Video lecture screen with interactive checklist. |
| `*` | `Error` | Public | 404 page. |

---

## 🛠️ Step-by-Step Local Setup & Run

### 1. Configuration Matrix

You must create two separate `.env` files:

#### Backend Settings
File location: `server/.env`
| Key | Type | Description | Example / Recommended Value |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | Port number the backend server runs on | `4000` |
| `MONGODB_URL` | String | URI connection string to MongoDB | `mongodb://localhost:27017/studynotion` |
| `JWT_SECRET` | String | Key used to sign JWT payloads | `your_random_secure_jwt_secret_string` |
| `FOLDER_NAME` | String | Cloudinary folder to dump uploads | `StudyNotion` |
| `MAIL_HOST` | String | SMTP email host provider | `smtp.gmail.com` |
| `MAIL_USER` | String | SMTP email username | `example_email@gmail.com` |
| `MAIL_PASS` | String | SMTP Gmail app password | `abcd efgh ijkl mnop` |
| `RAZORPAY_KEY` | String | Public Razorpay key ID | `rzp_test_xxxxxxxxxxxxxx` |
| `RAZORPAY_SECRET` | String | Private Razorpay key secret | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `CLOUD_NAME` | String | Cloudinary cloud identifier | `your_cloudinary_cloud_name` |
| `CLOUD_API_KEY` | String | Cloudinary API access key | `xxxxxxxxxxxxxxx` |
| `CLOUD_API_SECRET` | String | Cloudinary API access secret | `xxxxxxxxxxxxxxxxxxxxxxxxxxx` |

#### Frontend Settings
File location: `.env`
| Key | Type | Description | Default Value |
| :--- | :--- | :--- | :--- |
| `REACT_APP_BASE_URL` | String | Backend URL prefix for API queries | `http://localhost:4000/api/v1` |
| `RAZORPAY_KEY` | String | Client Razorpay key ID | `rzp_test_xxxxxxxxxxxxxx` |

---

### 2. Startup Guide

1. Make sure your local MongoDB instance is running:
   ```powershell
   # Windows Command to check/start local MongoDB service
   Start-Service -Name MongoDB
   ```
2. Open your terminal in the code folder `StudyNotion-EdTech-Platform-main/`.
3. Install the client packages:
   ```sh
   npm install
   ```
4. Install the server packages:
   ```sh
   cd server
   npm install
   ```
5. Run the client-server application concurrently:
   ```sh
   cd ..
   npm run dev
   ```
6. Open your browser:
   * Frontend: [http://localhost:3000](http://localhost:3000)
   * API Server: [http://localhost:4000](http://localhost:4000)
