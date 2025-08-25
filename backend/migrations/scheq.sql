-- 1. Academic Sessions
CREATE TABLE academic_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,        -- 2024-25
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active','inactive') DEFAULT 'inactive'
);

-- 2. Mediums
CREATE TABLE mediums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,        -- Hindi, English, French
    code VARCHAR(10),
    status ENUM('active','inactive') DEFAULT 'active'
);

-- 3. Departments
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    head_teacher_id INT,
    status ENUM('active','inactive') DEFAULT 'active'
);

-- 4. Subjects
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    subject_type ENUM('core','elective','optional') DEFAULT 'core',
    department_id INT,
    status ENUM('active','inactive') DEFAULT 'active',
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 5. Periods
CREATE TABLE periods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_time TIME,
    end_time TIME
);

-- 6. Grading System
CREATE TABLE grading_system (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    min_percentage DECIMAL(5,2),
    max_percentage DECIMAL(5,2),
    remark VARCHAR(100)
);

-- 7. Shifts
CREATE TABLE shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_time TIME,
    end_time TIME,
    status ENUM('active','inactive') DEFAULT 'active',
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id)
);

-- 8. Classes
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    medium_id INT,
    shift_id INT,
    name VARCHAR(50) NOT NULL,
    order_no INT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (medium_id) REFERENCES mediums(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

-- 9. Sections
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    name VARCHAR(10) NOT NULL,
    capacity INT DEFAULT 0,
    class_teacher_id INT,
    status ENUM('active','inactive') DEFAULT 'active',
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 10. Streams
CREATE TABLE streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 11. Class Subjects
CREATE TABLE class_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    stream_id INT NULL,
    subject_id INT NOT NULL,
    teacher_id INT,
    is_optional BOOLEAN DEFAULT FALSE,
    max_marks INT DEFAULT 100,
    theory_marks INT DEFAULT 0,
    practical_marks INT DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (stream_id) REFERENCES streams(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 12. Exams
CREATE TABLE exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    exam_type ENUM('formative','summative','board') DEFAULT 'formative',
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id)
);

-- 13. Exam Subjects
CREATE TABLE exam_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    class_id INT NOT NULL,
    stream_id INT NULL,
    subject_id INT NOT NULL,
    max_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 33,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (stream_id) REFERENCES streams(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 14. Students
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    section_id INT NOT NULL,
    stream_id INT NULL,
    roll_no VARCHAR(50),
    admission_no VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    dob DATE,
    gender ENUM('male','female','other'),
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (stream_id) REFERENCES streams(id)
);

-- 15. Student Promotions
CREATE TABLE student_promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    from_session_id INT NOT NULL,
    to_session_id INT NOT NULL,
    from_class_id INT NOT NULL,
    to_class_id INT NOT NULL,
    promoted_on DATE,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (from_session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (to_session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (from_class_id) REFERENCES classes(id),
    FOREIGN KEY (to_class_id) REFERENCES classes(id)
);

-- 16. Class Timetable
CREATE TABLE class_timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    section_id INT NOT NULL,
    period_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    day_of_week ENUM('mon','tue','wed','thu','fri','sat','sun'),
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (period_id) REFERENCES periods(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 17. Attendance
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present','absent','leave') DEFAULT 'present',
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 18. Assignments
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    section_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT,
    title VARCHAR(255),
    description TEXT,
    due_date DATE,
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 19. Assignment Submissions
CREATE TABLE assignment_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submitted_date DATE,
    marks INT,
    remark VARCHAR(255),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 20. Syllabus
CREATE TABLE syllabus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    class_id INT NOT NULL,
    stream_id INT NULL,
    subject_id INT NOT NULL,
    details TEXT,
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (stream_id) REFERENCES streams(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 21. Lesson Plans
CREATE TABLE lesson_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT,
    week_no INT,
    topic VARCHAR(255),
    FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
