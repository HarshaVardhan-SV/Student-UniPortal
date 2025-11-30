// app.js (FULL updated) - predefined users with profiles, login history, per-user profile display
// NOTE: client-side authentication is purely for demo. Do not use for production auth.

const { useState, useEffect } = React;

// ---------- Storage keys ----------
const USERS_DB_KEY = 'users_db_v2';
const LOGGED_USER_KEY = 'logged_user_v2'; // stores full user object as JSON
const LOGIN_HISTORY_KEY = 'login_history_v2';

// ---------- Default profile (used when no user is logged in) ----------
const DEFAULT_PROFILE = {
  name: "Guest",
  id: "",
  email: "",
  phone: "",
  program: "",
  year: "",
  semester: "",
  enrollmentDate: "",
  completedPrerequisites: ["CSE101", "CSE201"]
};

// ---------- Predefined users (seed) - each contains a profile ----------
const PREDEFINED_USERS = [
  {
    username: "Ramesh",
    password: "1234",
    profile: {
      name: "Ramesh Kumar",
      id: "2200030565",
      email: "ramesh.kumar@kluniversity.in",
      phone: "+91 9876543210",
      program: "B.Tech Computer Science & Engineering",
      year: "3rd Year",
      semester: "Fall 2025",
      enrollmentDate: "August 2023",
      completedPrerequisites: ["CSE101", "CSE201"]
    }
  },
  {
    username: "Ravi",
    password: "admin123",
    profile: {
      name: "Ravi Sharma",
      id: "2200030999",
      email: "ravi.sharma@kluniversity.in",
      phone: "+91 9000000001",
      program: "B.Tech Electronics & Communication",
      year: "2nd Year",
      semester: "Fall 2025",
      enrollmentDate: "August 2024",
      completedPrerequisites: ["ECE101"]
    }
  },
  {
    username: "Gopi",
    password: "pass1",
    profile: {
      name: "Gopi Reddy",
      id: "2200030123",
      email: "gopi.reddy@kluniversity.in",
      phone: "+91 9000000002",
      program: "B.Tech Mechanical Engineering",
      year: "3rd Year",
      semester: "Fall 2025",
      enrollmentDate: "August 2023",
      completedPrerequisites: ["MEC101"]
    }
  },
  {
    username: "Harsha",
    password: "pass2",
    profile: {
      name: "Harsha Kumar",
      id: "2200030456",
      email: "harsha.kumar@kluniversity.in",
      phone: "+91 9000000003",
      program: "B.Tech Civil Engineering",
      year: "4th Year",
      semester: "Fall 2025",
      enrollmentDate: "August 2022",
      completedPrerequisites: ["CIV101"]
    }
  },
  {
    username: "Ravi Babu",
    password: "teach123",
    profile: {
      name: "Ravi Babu",
      id: "F-0001",
      email: "ravibabu@kluniversity.in",
      phone: "+91 9000000004",
      program: "Faculty - CSE",
      year: "",
      semester: "",
      enrollmentDate: "N/A",
      completedPrerequisites: []
    }
  }
];

// Seed users if not present
if (!localStorage.getItem(USERS_DB_KEY)) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(PREDEFINED_USERS));
}

// ==================== SAMPLE DATA (courses, etc.) ====================
const COURSES_DATA = [
  { code: "CSE301", title: "Data Structures and Algorithms", instructor: "Dr. Rajesh Kumar", credits: 4, time: "Mon/Wed 9:00-10:30", capacity: 40, enrolled: 35, prerequisites: ["CSE101"], room: "Block-A 301", department: "CSE" },
  { code: "CSE302", title: "Database Management Systems", instructor: "Prof. Lakshmi Devi", credits: 4, time: "Tue/Thu 10:00-11:30", capacity: 40, enrolled: 38, prerequisites: ["CSE101"], room: "Block-A 302", department: "CSE" },
  { code: "CSE303", title: "Operating Systems", instructor: "Dr. Venkat Rao", credits: 4, time: "Mon/Wed 11:00-12:30", capacity: 35, enrolled: 30, prerequisites: ["CSE201"], room: "Block-B 201", department: "CSE" },
  { code: "CSE304", title: "Computer Networks", instructor: "Dr. Priya Sharma", credits: 3, time: "Tue/Thu 14:00-15:30", capacity: 40, enrolled: 25, prerequisites: [], room: "Block-A 305", department: "CSE" },
  { code: "CSE305", title: "Software Engineering", instructor: "Prof. Anil Kumar", credits: 3, time: "Wed/Fri 9:00-10:30", capacity: 35, enrolled: 32, prerequisites: ["CSE201"], room: "Block-C 101", department: "CSE" },
  { code: "CSE306", title: "Artificial Intelligence", instructor: "Dr. Srinivas Reddy", credits: 4, time: "Mon/Wed 14:00-15:30", capacity: 30, enrolled: 30, prerequisites: ["CSE301"], room: "Block-B 305", department: "CSE" },
  { code: "CSE307", title: "Machine Learning", instructor: "Dr. Kavya Reddy", credits: 4, time: "Tue/Thu 9:00-10:30", capacity: 35, enrolled: 28, prerequisites: ["CSE301"], room: "Block-A 201", department: "CSE" },
  { code: "CSE308", title: "Web Technologies", instructor: "Prof. Suresh Babu", credits: 3, time: "Mon/Wed 15:00-16:30", capacity: 40, enrolled: 22, prerequisites: [], room: "Lab-1", department: "CSE" },
  { code: "CSE309", title: "Cloud Computing", instructor: "Dr. Ramya Krishna", credits: 3, time: "Thu/Fri 11:00-12:30", capacity: 30, enrolled: 18, prerequisites: ["CSE304"], room: "Block-C 205", department: "CSE" },
  { code: "ECE201", title: "Digital Electronics", instructor: "Dr. Madhavi Latha", credits: 4, time: "Mon/Wed 10:00-11:30", capacity: 40, enrolled: 35, prerequisites: [], room: "ECE Block 101", department: "ECE" },
  { code: "ECE202", title: "Signals and Systems", instructor: "Prof. Krishna Murthy", credits: 4, time: "Tue/Thu 11:00-12:30", capacity: 35, enrolled: 32, prerequisites: [], room: "ECE Block 102", department: "ECE" },
  { code: "MAT301", title: "Discrete Mathematics", instructor: "Dr. Subba Rao", credits: 3, time: "Mon/Wed 13:00-14:30", capacity: 50, enrolled: 45, prerequisites: [], room: "Block-D 301", department: "Mathematics" },
  { code: "EEE201", title: "Electrical Circuits", instructor: "Dr. Vijaya Kumar", credits: 4, time: "Tue/Thu 13:00-14:30", capacity: 40, enrolled: 30, prerequisites: [], room: "EEE Block 201", department: "EEE" },
  { code: "MEC201", title: "Engineering Mechanics", instructor: "Prof. Narasimha Rao", credits: 4, time: "Wed/Fri 14:00-15:30", capacity: 45, enrolled: 40, prerequisites: [], room: "Mech Block 101", department: "Mechanical" },
  { code: "CSE310", title: "Cyber Security", instructor: "Dr. Harish Chandra", credits: 3, time: "Fri 9:00-12:00", capacity: 30, enrolled: 25, prerequisites: ["CSE304"], room: "Lab-3", department: "CSE" }
];

const PAST_COURSES = [
  { code: "CSE101", title: "Introduction to Programming", credits: 4, grade: "A", semester: "Fall 2023" },
  { code: "CSE102", title: "Digital Logic Design", credits: 3, grade: "A-", semester: "Fall 2023" },
  { code: "MAT101", title: "Calculus I", credits: 4, grade: "B+", semester: "Fall 2023" },
  { code: "CSE201", title: "Object Oriented Programming", credits: 4, grade: "A", semester: "Spring 2024" },
  { code: "CSE202", title: "Discrete Structures", credits: 3, grade: "A-", semester: "Spring 2024" },
  { code: "MAT201", title: "Linear Algebra", credits: 3, grade: "B+", semester: "Spring 2024" },
  { code: "PHY101", title: "Physics I", credits: 4, grade: "B", semester: "Fall 2024" },
  { code: "ENG101", title: "English Communication", credits: 2, grade: "A", semester: "Fall 2024" }
];

// ==================== UTILITIES ====================
function parseTimeSlot(timeStr) {
  const parts = timeStr.split(' ');
  const days = parts[0].split('/').map(d => d.trim());
  const timePart = parts[1];
  const [start, end] = timePart.split('-');
  return { days, start, end };
}
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}
function checkTimeConflict(time1, time2) {
  const slot1 = parseTimeSlot(time1);
  const slot2 = parseTimeSlot(time2);
  const dayOverlap = slot1.days.some(day => slot2.days.includes(day));
  if (!dayOverlap) return false;
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);
  return (start1 < end2 && end1 > start2);
}
function calculateGPA(courses) {
  const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0 };
  let totalPoints = 0, totalCredits = 0;
  courses.forEach(course => {
    const points = gradePoints[course.grade] || 0;
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  });
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

// ==================== AUTH: LoginPage ====================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const match = users.find(u => u.username === username && u.password === password);
    if (!match) {
      setError('Invalid username or password');
      return;
    }

    // add login history
    const history = JSON.parse(localStorage.getItem(LOGIN_HISTORY_KEY) || '[]');
    history.unshift({ username: match.username, time: new Date().toISOString() });
    if (history.length > 200) history.length = 200;
    localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(history));

    // store full user object so we can restore profile on refresh
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(match));

    // notify parent (App) to update currentUser
    onLogin(match);
  };

  useEffect(() => setError(''), [username, password]);

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 className="auth-title">KL University — Student Portal</h2>
        <p className="auth-sub">Sign in with your demo account</p>

        <div style={{ marginTop: 16 }}>
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <input
            className="form-control"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          {error && <div style={{ color: '#c62828', marginBottom: 10 }}>{error}</div>}
          <button className="btn btn-primary btn-full" onClick={handleLogin}>Login</button>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
          Demo users: {PREDEFINED_USERS.map(u => u.username).join(', ')}
        </div>
      </div>
    </div>
  );
}

// ==================== TOASTS ====================
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" style={{ position: 'fixed', right: 20, bottom: 20 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} style={{ marginBottom: 8, padding: 10, background: '#fff', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ==================== SIDEBAR ====================
function Sidebar({ currentPage, setCurrentPage, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'catalog', label: 'Course Catalog', icon: '📚' },
    { id: 'builder', label: 'Schedule Builder', icon: '📅' },
    { id: 'timetable', label: 'My Timetable', icon: '🕐' },
    { id: 'records', label: 'Records', icon: '📄' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileOpen(false);
  };

  return (
    <div className={`sidebar ${mobileOpen ? 'mobile-open' : 'mobile-closed'}`}>
      <div className="sidebar-header">
        <h2>KL University</h2>
        <p>Student Portal</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <a
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-link-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

// ==================== PAGES ====================

// Dashboard expects a profile prop to display user info
function DashboardPage({ enrolledCourses, profile }) {
  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credits, 0);
  const displayName = profile?.name || DEFAULT_PROFILE.name;

  return (
    <div>
      <div className="welcome-banner">
        <h2>Welcome back, {displayName}!</h2>
        <p>Ready to continue your academic journey at KL University</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <div className="stat-value">{enrolledCourses.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Credits</h3>
          <div className="stat-value">{totalCredits}</div>
        </div>
        <div className="stat-card">
          <h3>Current GPA</h3>
          <div className="stat-value">{calculateGPA(PAST_COURSES)}</div>
        </div>
        <div className="stat-card">
          <h3>Completed Courses</h3>
          <div className="stat-value">{PAST_COURSES.length}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Student Information</h3>
        <div className="profile-info-grid">
          <div className="info-item">
            <div className="info-label">Student ID</div>
            <div className="info-value">{profile?.id || ''}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Program</div>
            <div className="info-value">{profile?.program || ''}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Year</div>
            <div className="info-value">{profile?.year || ''}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Semester</div>
            <div className="info-value">{profile?.semester || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCatalogPage({ courses, enrolledCourses, onEnroll, completedPrereqs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');

  const departments = ['All', ...new Set(courses.map(c => c.department))];

  const getButtonState = (course) => {
    const isEnrolled = enrolledCourses.some(c => c.code === course.code);
    const isFull = course.enrolled >= course.capacity;
    const prereqsMet = course.prerequisites.every(p => completedPrereqs.includes(p));

    if (isEnrolled) return { text: 'Enrolled', disabled: true, className: 'btn-success' };
    if (isFull) return { text: 'Full', disabled: true, className: 'btn-secondary' };
    if (!prereqsMet) return { text: 'Prerequisite Required', disabled: true, className: 'btn-secondary' };
    return { text: 'Enroll', disabled: false, className: 'btn-primary' };
  };

  const getTimeSlot = (time) => {
    const hour = parseInt(time.split(' ')[1].split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || course.department === departmentFilter;
    const matchesTime = timeFilter === 'All' || getTimeSlot(course.time) === timeFilter;
    return matchesSearch && matchesDept && matchesTime;
  });

  return (
    <div>
      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search courses by code or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="All">All Times</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => {
          const buttonState = getButtonState(course);
          return (
            <div key={course.code} className="course-card">
              <div className="course-code">{course.code}</div>
              <div className="course-title">{course.title}</div>
              <div className="course-instructor">👨‍🏫 {course.instructor}</div>

              <div className="course-details">
                <span className="detail-badge">📖 {course.credits} Credits</span>
                <span className="detail-badge">🕐 {course.time}</span>
              </div>

              <div className="course-capacity">
                📊 Capacity: {course.enrolled}/{course.capacity}
              </div>

              {course.prerequisites.length > 0 && (
                <div className="course-prerequisites">
                  Prerequisites: {course.prerequisites.join(', ')}
                </div>
              )}

              <button
                className={`btn ${buttonState.className} btn-full`}
                disabled={buttonState.disabled}
                onClick={() => onEnroll(course)}
              >
                {buttonState.text}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleBuilderPage({ courses, enrolledCourses, scheduleCart, setScheduleCart, onFinalize, completedPrereqs }) {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    const newConflicts = [];
    for (let i = 0; i < scheduleCart.length; i++) {
      for (let j = i + 1; j < scheduleCart.length; j++) {
        if (checkTimeConflict(scheduleCart[i].time, scheduleCart[j].time)) {
          newConflicts.push({ course1: scheduleCart[i], course2: scheduleCart[j] });
        }
      }
    }
    setConflicts(newConflicts);
  }, [scheduleCart]);

  const addToCart = (course) => {
    if (!scheduleCart.find(c => c.code === course.code)) {
      setScheduleCart(prev => [...prev, course]);
    }
  };

  const removeFromCart = (courseCode) => {
    setScheduleCart(prev => prev.filter(c => c.code !== courseCode));
  };

  const availableCourses = courses.filter(course => {
    const notEnrolled = !enrolledCourses.some(c => c.code === course.code);
    const notInCart = !scheduleCart.some(c => c.code === course.code);
    const notFull = course.enrolled < course.capacity;
    const prereqsMet = course.prerequisites.every(p => completedPrereqs.includes(p));
    return notEnrolled && notInCart && notFull && prereqsMet;
  });

  const totalCredits = scheduleCart.reduce((sum, c) => sum + c.credits, 0);

  const isConflicting = (course) => {
    return conflicts.some(c => c.course1.code === course.code || c.course2.code === course.code);
  };

  return (
    <div className="schedule-builder-layout">
      <div>
        <h3 className="section-title">Available Courses</h3>
        <div className="available-courses-list">
          {availableCourses.map(course => (
            <div key={course.code} className="course-list-item">
              <div className="course-list-info">
                <h4>{course.code} - {course.title}</h4>
                <p>🕐 {course.time} | 📖 {course.credits} credits</p>
                <p>📊 {course.enrolled}/{course.capacity} enrolled</p>
              </div>
              <button className="btn btn-primary" onClick={() => addToCart(course)}>Add</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="section-title">My Schedule</h3>

        {conflicts.length > 0 && (
          <div className="conflict-warning">
            ⚠️ <strong>Time Conflict Detected:</strong>
            <br />
            {conflicts.map((conflict, idx) => (
              <div key={idx}>{conflict.course1.code} conflicts with {conflict.course2.code}</div>
            ))}
          </div>
        )}

        <div className="my-schedule-list">
          {scheduleCart.length === 0 ? (
            <div className="card text-center"><p>No courses added yet. Add courses from the left to build your schedule.</p></div>
          ) : (
            scheduleCart.map(course => (
              <div key={course.code} className={`course-list-item ${isConflicting(course) ? 'conflict-item' : ''}`}>
                <div className="course-list-info">
                  <h4>{course.code} - {course.title}</h4>
                  <p>🕐 {course.time} | 📖 {course.credits} credits</p>
                  <p>👨‍🏫 {course.instructor}</p>
                </div>
                <button className="btn btn-danger" onClick={() => removeFromCart(course.code)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {scheduleCart.length > 0 && (
          <>
            <div className="total-credits">Total Credits: {totalCredits}</div>
            <button className="btn btn-primary btn-full mt-16" disabled={conflicts.length > 0 || scheduleCart.length === 0} onClick={onFinalize}>Finalize Enrollment</button>
          </>
        )}
      </div>
    </div>
  );
}

function TimetablePage({ enrolledCourses }) {
  const timeSlots = ['9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00'];
  const days = ['Mon','Tue','Wed','Thu','Fri'];

  const courseColors = ['course-color-1','course-color-2','course-color-3','course-color-4','course-color-5','course-color-6','course-color-7','course-color-8'];

  const getCourseColor = (courseCode) => {
    const index = enrolledCourses.findIndex(c => c.code === courseCode);
    return courseColors[index % courseColors.length];
  };

  const getCourseForSlot = (day, timeSlot) => {
    const [slotStart] = timeSlot.split('-');
    for (const course of enrolledCourses) {
      const parsed = parseTimeSlot(course.time);
      if (parsed.days.includes(day)) {
        const courseStart = timeToMinutes(parsed.start);
        const courseEnd = timeToMinutes(parsed.end);
        const slotStartMin = timeToMinutes(slotStart);
        if (slotStartMin >= courseStart && slotStartMin < courseEnd) return course;
      }
    }
    return null;
  };

  const getRowSpan = (course, day, timeSlot) => {
    const parsed = parseTimeSlot(course.time);
    if (!parsed.days.includes(day)) return 1;
    const [slotStart] = timeSlot.split('-');
    const courseStart = timeToMinutes(parsed.start);
    const slotStartMin = timeToMinutes(slotStart);
    if (slotStartMin !== courseStart) return 0;
    const courseEnd = timeToMinutes(parsed.end);
    const durationMinutes = courseEnd - courseStart;
    return Math.ceil(durationMinutes / 60);
  };

  return (
    <div className="timetable-container">
      {enrolledCourses.length === 0 ? (
        <div className="text-center"><p>No courses enrolled yet. Visit the Course Catalog or Schedule Builder to enroll in courses.</p></div>
      ) : (
        <table className="timetable">
          <thead><tr><th>Time</th>{days.map(day => <th key={day}>{day}</th>)}</tr></thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="time-cell">{slot}</td>
                {days.map(day => {
                  const course = getCourseForSlot(day, slot);
                  if (!course) return <td key={day} className="empty-cell"></td>;
                  const rowSpan = getRowSpan(course, day, slot);
                  if (rowSpan === 0) return null;
                  return (
                    <td key={day} rowSpan={rowSpan}>
                      <div className={`course-block ${getCourseColor(course.code)}`}>
                        <div className="course-block-code">{course.code}</div>
                        <div className="course-block-title">{course.title}</div>
                        <div className="course-block-room">📍 {course.room}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function RecordsPage() {
  const [selectedSemester, setSelectedSemester] = useState('All');
  const semesters = ['All', ...new Set(PAST_COURSES.map(c => c.semester))];
  const filteredCourses = selectedSemester === 'All' ? PAST_COURSES : PAST_COURSES.filter(c => c.semester === selectedSemester);
  const getGradeClass = (grade) => grade.startsWith('A') ? 'grade-a' : grade.startsWith('B') ? 'grade-b' : 'grade-c';

  return (
    <div>
      <div className="semester-selector">
        <label style={{ marginRight: '12px', fontWeight: 600 }}>Select Semester:</label>
        <select className="filter-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          {semesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
        </select>
      </div>

      <div className="records-table">
        <table>
          <thead><tr><th>Course Code</th><th>Course Title</th><th>Credits</th><th>Grade</th><th>Semester</th></tr></thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.code}>
                <td><strong>{course.code}</strong></td>
                <td>{course.title}</td>
                <td>{course.credits}</td>
                <td><span className={`grade-badge ${getGradeClass(course.grade)}`}>{course.grade}</span></td>
                <td>{course.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gpa-summary">
        <h3>Cumulative GPA</h3>
        <div className="gpa-value">{calculateGPA(PAST_COURSES)}</div>
      </div>
    </div>
  );
}

// ProfilePage now accepts profile prop
function ProfilePage({ profile, onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem(LOGIN_HISTORY_KEY) || '[]');
    setHistory(raw);
  }, []);

  const clearHistory = () => {
    if (confirm('Clear login history?')) {
      localStorage.removeItem(LOGIN_HISTORY_KEY);
      setHistory([]);
    }
  };

  const handleEdit = () => alert('Edit Profile functionality would be implemented here.');

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{(profile?.name || DEFAULT_PROFILE.name).split(' ').map(n => n[0]).join('')}</div>
        <h2>{profile?.name || DEFAULT_PROFILE.name}</h2>
        <p>{profile?.program || DEFAULT_PROFILE.program}</p>
      </div>

      <div className="card">
        <h3 className="section-title">Personal Information</h3>
        <div className="profile-info-grid">
          <div className="info-item"><div className="info-label">Full Name</div><div className="info-value">{profile?.name}</div></div>
          <div className="info-item"><div className="info-label">Student ID</div><div className="info-value">{profile?.id}</div></div>
          <div className="info-item"><div className="info-label">Email</div><div className="info-value">{profile?.email}</div></div>
          <div className="info-item"><div className="info-label">Phone</div><div className="info-value">{profile?.phone}</div></div>
          <div className="info-item"><div className="info-label">Program</div><div className="info-value">{profile?.program}</div></div>
          <div className="info-item"><div className="info-label">Year</div><div className="info-value">{profile?.year}</div></div>
          <div className="info-item"><div className="info-label">Enrollment Date</div><div className="info-value">{profile?.enrollmentDate}</div></div>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="card">
        <h3 className="section-title">Login History</h3>
        <div style={{ marginBottom: 8 }}>
          <button className="btn btn-secondary" onClick={clearHistory}>Clear history</button>
        </div>
        <div style={{ maxHeight: 220, overflow: 'auto' }}>
          {history.length === 0 ? <div style={{ color: '#666' }}>No login history yet.</div> : (
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {history.map((h, i) => (
                <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                  <strong>{h.username}</strong> — <span style={{ color: '#777' }}>{new Date(h.time).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="profile-actions" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
        <button className="btn btn-danger" onClick={onLogout} style={{ marginLeft: 8 }}>Logout</button>
      </div>
    </div>
  );
}

// ==================== MAIN APP (auth-aware) ====================
function App() {
  // restore stored logged user (object) if present
  const storedUser = JSON.parse(localStorage.getItem(LOGGED_USER_KEY) || 'null');
  const [currentUser, setCurrentUser] = useState(storedUser); // will be full user object or null

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [scheduleCart, setScheduleCart] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [courses, setCourses] = useState(COURSES_DATA);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    // If we restored a stored user, ensure UI is consistent (no-op if null)
    if (storedUser && storedUser.profile) {
      addToast(`Restored session: ${storedUser.username}`, 'info');
    }
  }, []);

  const handleEnroll = (course) => {
    setTimeout(() => {
      const hasConflict = enrolledCourses.some(enrolled => checkTimeConflict(enrolled.time, course.time));
      if (hasConflict) { addToast('Cannot enroll: Time conflict detected!', 'error'); return; }
      setEnrolledCourses(prev => [...prev, course]);
      setCourses(prev => prev.map(c => c.code === course.code ? { ...c, enrolled: c.enrolled + 1 } : c));
      addToast(`Successfully enrolled in ${course.code}!`, 'success');
    }, 400);
  };

  const handleFinalizeEnrollment = () => {
    setEnrolledCourses(prev => [...prev, ...scheduleCart]);
    setCourses(prev => prev.map(c => scheduleCart.find(s => s.code === c.code) ? { ...c, enrolled: c.enrolled + 1 } : c));
    addToast(`Successfully enrolled in ${scheduleCart.length} courses!`, 'success');
    setScheduleCart([]);
    setCurrentPage('timetable');
  };

  // Auth handlers
  const handleLogin = (userObj) => {
    // userObj is the full matched user (username,password,profile)
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(userObj));
    setCurrentUser(userObj);
    addToast(`Signed in as ${userObj.username}`, 'success');
  };

  const handleLogout = () => {
    if (!confirm('Are you sure you want to logout?')) return;
    localStorage.removeItem(LOGGED_USER_KEY);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    addToast('Signed out', 'info');
  };

  const getPageTitle = () => {
    const titles = { dashboard: 'Dashboard', catalog: 'Course Catalog', builder: 'Schedule Builder', timetable: 'My Timetable', records: 'Academic Records', profile: 'Profile' };
    return titles[currentPage] || 'Dashboard';
  };

  const profile = currentUser?.profile || DEFAULT_PROFILE;
  const completedPrereqs = profile.completedPrerequisites || DEFAULT_PROFILE.completedPrerequisites;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage enrolledCourses={enrolledCourses} profile={profile} />;
      case 'catalog': return <CourseCatalogPage courses={courses} enrolledCourses={enrolledCourses} onEnroll={handleEnroll} completedPrereqs={completedPrereqs} />;
      case 'builder': return <ScheduleBuilderPage courses={courses} enrolledCourses={enrolledCourses} scheduleCart={scheduleCart} setScheduleCart={setScheduleCart} onFinalize={handleFinalizeEnrollment} completedPrereqs={completedPrereqs} />;
      case 'timetable': return <TimetablePage enrolledCourses={enrolledCourses} />;
      case 'records': return <RecordsPage />;
      case 'profile': return <ProfilePage profile={profile} onLogout={handleLogout} />;
      default: return <DashboardPage enrolledCourses={enrolledCourses} profile={profile} />;
    }
  };

  // Not logged in -> show LoginPage
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Logged-in UI
  return (
    <>
      <button className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>

      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="main-content">
        <div className="top-header">
          <h1>{getPageTitle()}</h1>
          <div className="student-info-badge">
            <div className="student-avatar">{(profile.name || DEFAULT_PROFILE.name).split(' ').map(n => n[0]).join('')}</div>
            <div>
              <div style={{ fontWeight: 600, color: '#333' }}>{profile.name}</div>
              <div style={{ fontSize: '12px' }}>{profile.id}</div>
            </div>
          </div>
        </div>

        <div className="content-area">{renderPage()}</div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}

// mount
ReactDOM.render(<App />, document.getElementById('root'));
