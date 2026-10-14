-- ============================================================================
-- LAB SHEET - 7 : COMPLETE DATABASE SOLUTION
-- Database: college_db
-- Topics: DDL, DML, Querying (SELECT), Functions & Aggregations,
--         Joins, Subqueries, Indexes, Views, Transactions, & Advanced SQL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 0: DATABASE CREATION & INITIAL SETUP
-- ----------------------------------------------------------------------------
DROP DATABASE IF EXISTS college_db;
CREATE DATABASE college_db;
USE college_db;   -- (For PostgreSQL use: \c college_db)

-- 1. Departments Table
CREATE TABLE departments (
    dept_id   INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Students Table
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    age        INT CHECK (age >= 17),
    city       VARCHAR(50),
    dept_id    INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 3. Courses Table
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    title     VARCHAR(80) NOT NULL,
    credits   INT DEFAULT 3,
    dept_id   INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 4. Enrollments Table
CREATE TABLE enrollments (
    student_id INT,
    course_id  INT,
    marks      INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id)  REFERENCES courses(course_id)
);

-- ----------------------------------------------------------------------------
-- INSERT SAMPLE DATA
-- ----------------------------------------------------------------------------
INSERT INTO departments VALUES 
(1, 'CSE'),
(2, 'ECE'),
(3, 'Mechanical'),
(4, 'Civil');

INSERT INTO students VALUES
(101, 'Aarav', 20, 'Roorkee', 1),
(102, 'Diya', 21, 'Dehradun', 1),
(103, 'Kabir', 19, 'Haridwar', 2),
(104, 'Meera', 22, 'Roorkee', 1),
(105, 'Rohan', 20, 'Delhi', 3),
(106, 'Sana', 21, 'Dehradun', 2),
(107, 'Vikram', 23, 'Jaipur', NULL),
(108, 'Isha', 19, 'Roorkee', 2);

INSERT INTO courses VALUES
(201, 'Data Structures', 4, 1),
(202, 'Operating Systems', 4, 1),
(203, 'Digital Electronics', 3, 2),
(204, 'Thermodynamics', 3, 3),
(205, 'Machine Learning', 4, 1);

INSERT INTO enrollments VALUES
(101, 201, 88), (101, 202, 76), (101, 205, 91),
(102, 201, 67), (102, 205, 72),
(103, 203, 81),
(104, 201, 95), (104, 202, 89),
(105, 204, 58),
(106, 203, 74),
(108, 203, 66);

-- Check: Confirm 8 rows are returned
SELECT * FROM students;


-- ============================================================================
-- PART A: DDL (DATA DEFINITION LANGUAGE)
-- ============================================================================

-- A1: Create table faculty with columns: faculty_id (PK), name (NOT NULL), 
--     email (UNIQUE), salary, dept_id (FK to departments).
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    email      VARCHAR(100) UNIQUE,
    salary     DECIMAL(10, 2),
    dept_id    INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- A2: Add a new column phone (VARCHAR(15)) to faculty using ALTER TABLE.
ALTER TABLE faculty 
ADD phone VARCHAR(15);

-- A3: Rename the column phone to contact_no.
-- Note: MySQL 8.0+ and PostgreSQL support 'RENAME COLUMN':
ALTER TABLE faculty 
RENAME COLUMN phone TO contact_no;
-- (In older MySQL versions < 8.0: ALTER TABLE faculty CHANGE phone contact_no VARCHAR(15);)

-- A4: Drop the column contact_no.
ALTER TABLE faculty 
DROP COLUMN contact_no;

-- A5: Remove the faculty table completely, then explain the difference between 
--     DROP, TRUNCATE and DELETE.
DROP TABLE faculty;

/*
EXPLANATION (A5): Difference between DROP, TRUNCATE, and DELETE:
1. DELETE (DML - Data Manipulation Language):
   - Removes specific rows based on a WHERE condition (or all rows if WHERE is omitted).
   - Can be rolled back (inside a transaction).
   - Slow for large datasets because each row deletion is logged individually.
   - Activates DELETE triggers.
   - Table structure remains intact.

2. TRUNCATE (DDL - Data Definition Language):
   - Removes ALL rows from a table by deallocating the data pages.
   - Does NOT support a WHERE clause.
   - Much faster than DELETE because it does not log row deletions individually.
   - Resets AUTO_INCREMENT counter to its initial value.
   - Table structure remains intact.

3. DROP (DDL - Data Definition Language):
   - Deletes the entire table structure along with all its data, constraints, indexes, and triggers.
   - The table ceases to exist in the database.
   - Cannot be undone unless restored from a backup.
*/


-- ============================================================================
-- PART B: DML (DATA MANIPULATION LANGUAGE)
-- ============================================================================

-- B1: Insert a new student: (109, 'Neha', 20, 'Roorkee', 1).
INSERT INTO students (student_id, name, age, city, dept_id)
VALUES (109, 'Neha', 20, 'Roorkee', 1);

-- B2: Insert a student without specifying city and observe the value stored.
INSERT INTO students (student_id, name, age, dept_id)
VALUES (110, 'Amit', 21, 2);

-- Observation: Check the stored record
SELECT * FROM students WHERE student_id = 110;
-- Observation Note: The 'city' column gets stored as NULL because no default value was defined.

-- B3: Update the city of student 105 to 'Roorkee'.
UPDATE students 
SET city = 'Roorkee' 
WHERE student_id = 105;

-- B4: Increase marks by 5 for all enrollments in course 203.
UPDATE enrollments 
SET marks = marks + 5 
WHERE course_id = 203;

-- B5: Delete the student with student_id = 109 (and test row 110).
DELETE FROM students WHERE student_id = 109;
DELETE FROM students WHERE student_id = 110;

-- B6: Try inserting a student with age 15. Record error and explain constraint.
-- UNCOMMENT TO TEST ERROR:
-- INSERT INTO students (student_id, name, age, city, dept_id) 
-- VALUES (111, 'Chirag', 15, 'Delhi', 1);

/*
EXPLANATION (B6):
- Error Message: 
  ERROR 3819 (HY000): Check constraint 'students_chk_1' is violated.
- Reason:
  During table creation, we defined `age INT CHECK (age >= 17)`.
  Since 15 is strictly less than 17, the CHECK constraint condition evaluates to FALSE 
  and the RDBMS rejects the INSERT operation.
*/


-- ============================================================================
-- PART C: QUERYING WITH SELECT
-- ============================================================================

-- C1: Display all columns of all students.
SELECT * FROM students;

-- C2: Display only the name and city of all students.
SELECT name, city FROM students;

-- C3: List students from Roorkee.
SELECT * FROM students 
WHERE city = 'Roorkee';

-- C4: List students aged between 20 and 22 (use BETWEEN).
SELECT * FROM students 
WHERE age BETWEEN 20 AND 22;

-- C5: List students from Roorkee or Dehradun (use IN).
SELECT * FROM students 
WHERE city IN ('Roorkee', 'Dehradun');

-- C6: List students whose name starts with 'A' (use LIKE).
SELECT * FROM students 
WHERE name LIKE 'A%';

-- C7: List students who have no department assigned (use IS NULL).
SELECT * FROM students 
WHERE dept_id IS NULL;

-- C8: Display distinct cities of all students.
SELECT DISTINCT city FROM students;

-- C9: Display students sorted by age in descending order, then by name ascending.
SELECT * FROM students 
ORDER BY age DESC, name ASC;

-- C10: Display the top 3 oldest students (LIMIT).
SELECT * FROM students 
ORDER BY age DESC 
LIMIT 3;

-- C11: Display name as Student Name and age as Age using aliases.
SELECT name AS `Student Name`, age AS `Age` 
FROM students;


-- ============================================================================
-- PART D: FUNCTIONS AND AGGREGATION
-- ============================================================================

-- D1: Find the total number of students.
SELECT COUNT(*) AS total_students 
FROM students;

-- D2: Find the average, minimum and maximum marks in the enrollments table.
SELECT 
    AVG(marks) AS average_marks,
    MIN(marks) AS minimum_marks,
    MAX(marks) AS maximum_marks
FROM enrollments;

-- D3: Count the number of students in each city.
SELECT city, COUNT(*) AS student_count 
FROM students 
GROUP BY city;

-- D4: Find the average marks for each course.
SELECT course_id, AVG(marks) AS average_marks 
FROM enrollments 
GROUP BY course_id;

-- D5: Show only those cities that have more than one student (HAVING).
SELECT city, COUNT(*) AS student_count 
FROM students 
GROUP BY city 
HAVING COUNT(*) > 1;

-- D6: Find the total credits offered by each department.
SELECT dept_id, SUM(credits) AS total_credits 
FROM courses 
GROUP BY dept_id;

-- D7: Display student names in uppercase and the length of each name (UPPER, LENGTH).
SELECT 
    name, 
    UPPER(name) AS uppercase_name, 
    LENGTH(name) AS name_length 
FROM students;

-- D8: Explain why WHERE cannot be used with aggregate functions, and what HAVING does differently.
/*
EXPLANATION (D8):
- WHERE Clause:
  Operates on individual rows BEFORE any grouping or aggregate calculation occurs.
  Because aggregate functions (like SUM, AVG, COUNT) summarize groups of rows, their values
  do not exist yet when the WHERE clause executes.

- HAVING Clause:
  Operates on grouped records AFTER the GROUP BY clause and aggregate calculations are performed.
  It filters summary results based on aggregate conditions (e.g., HAVING COUNT(*) > 1).
*/


-- ============================================================================
-- PART E: JOINS
-- ============================================================================

-- E1: Display each student's name along with their department name (INNER JOIN).
SELECT s.name AS student_name, d.dept_name 
FROM students s 
INNER JOIN departments d ON s.dept_id = d.dept_id;

-- E2: Display all students, including those without a department (LEFT JOIN). Which student shows NULL?
SELECT s.name AS student_name, d.dept_name 
FROM students s 
LEFT JOIN departments d ON s.dept_id = d.dept_id;
-- Note: Student 'Vikram' shows NULL for dept_name because his dept_id is NULL.

-- E3: Display all departments, including those with no students (RIGHT JOIN or LEFT JOIN).
SELECT d.dept_name, s.name AS student_name 
FROM students s 
RIGHT JOIN departments d ON s.dept_id = d.dept_id;
-- Note: 'Civil' department shows NULL for student_name because no student belongs to it.

-- E4: Display student name, course title and marks by joining students, enrollments and courses.
SELECT s.name AS student_name, c.title AS course_title, e.marks 
FROM students s 
INNER JOIN enrollments e ON s.student_id = e.student_id 
INNER JOIN courses c     ON e.course_id = c.course_id;

-- E5: List the names of students enrolled in 'Data Structures'.
SELECT DISTINCT s.name AS student_name 
FROM students s 
INNER JOIN enrollments e ON s.student_id = e.student_id 
INNER JOIN courses c     ON e.course_id = c.course_id 
WHERE c.title = 'Data Structures';

-- E6: Find students who are not enrolled in any course (LEFT JOIN with IS NULL).
SELECT s.student_id, s.name AS student_name 
FROM students s 
LEFT JOIN enrollments e ON s.student_id = e.student_id 
WHERE e.course_id IS NULL;

-- E7: Display the number of students enrolled in each course (include courses with zero enrollments).
SELECT c.course_id, c.title AS course_title, COUNT(e.student_id) AS enrolled_students 
FROM courses c 
LEFT JOIN enrollments e ON c.course_id = e.course_id 
GROUP BY c.course_id, c.title;

-- E8: Display each department with its number of students and its average age.
SELECT 
    d.dept_id, 
    d.dept_name, 
    COUNT(s.student_id) AS total_students, 
    AVG(s.age) AS average_age 
FROM departments d 
LEFT JOIN students s ON d.dept_id = s.dept_id 
GROUP BY d.dept_id, d.dept_name;


-- ============================================================================
-- PART F: SUBQUERIES
-- ============================================================================

-- F1: Find students whose age is greater than the average age.
SELECT * 
FROM students 
WHERE age > (SELECT AVG(age) FROM students);

-- F2: Find the student(s) with the highest marks in any course.
SELECT s.student_id, s.name AS student_name, e.course_id, e.marks 
FROM students s 
INNER JOIN enrollments e ON s.student_id = e.student_id 
WHERE e.marks = (SELECT MAX(marks) FROM enrollments);

-- F3: List courses that have at least one enrollment (using IN or EXISTS).
-- Method 1: Using IN
SELECT * 
FROM courses 
WHERE course_id IN (SELECT DISTINCT course_id FROM enrollments);

-- Method 2: Using EXISTS
SELECT * 
FROM courses c 
WHERE EXISTS (
    SELECT 1 FROM enrollments e WHERE e.course_id = c.course_id
);

-- F4: List students enrolled in more than 2 courses.
SELECT * 
FROM students 
WHERE student_id IN (
    SELECT student_id 
    FROM enrollments 
    GROUP BY student_id 
    HAVING COUNT(course_id) > 2
);

-- F5: Find the department with the highest number of students.
SELECT d.dept_id, d.dept_name, COUNT(s.student_id) AS student_count 
FROM departments d 
INNER JOIN students s ON d.dept_id = s.dept_id 
GROUP BY d.dept_id, d.dept_name 
HAVING COUNT(s.student_id) = (
    SELECT MAX(dept_count) 
    FROM (
        SELECT COUNT(student_id) AS dept_count 
        FROM students 
        WHERE dept_id IS NOT NULL 
        GROUP BY dept_id
    ) AS counts
);

-- F6: For each course, list students who scored above that course's average (correlated subquery).
SELECT 
    c.title AS course_title,
    s.name AS student_name,
    e.marks,
    ROUND(course_avg.avg_marks, 2) AS course_average
FROM enrollments e
INNER JOIN students s ON e.student_id = s.student_id
INNER JOIN courses c  ON e.course_id = c.course_id
INNER JOIN (
    SELECT course_id, AVG(marks) AS avg_marks 
    FROM enrollments 
    GROUP BY course_id
) AS course_avg ON e.course_id = course_avg.course_id
WHERE e.marks > (
    SELECT AVG(e2.marks) 
    FROM enrollments e2 
    WHERE e2.course_id = e.course_id
);


-- ============================================================================
-- PART G: INDEXES, VIEWS AND TRANSACTIONS
-- ============================================================================

-- G1: Create an index on students(city). Run EXPLAIN and observe the query plan.
CREATE INDEX idx_student_city ON students(city);

EXPLAIN SELECT * FROM students WHERE city = 'Roorkee';

/*
Observation Note for G1:
- Before index: Type is 'ALL' (Full Table Scan), examining all rows in table.
- After index: Type changes to 'ref', using 'idx_student_city' key, examining only matching rows.
*/

-- G2: Create a view student_marks that shows student name, course title and marks.
CREATE OR REPLACE VIEW student_marks AS 
SELECT s.name AS student_name, c.title AS course_title, e.marks 
FROM students s 
INNER JOIN enrollments e ON s.student_id = e.student_id 
INNER JOIN courses c     ON e.course_id = c.course_id;

-- G3: Query the view to list students scoring above 80.
SELECT * FROM student_marks 
WHERE marks > 80;

-- G4: Drop the view and the index.
DROP VIEW student_marks;
DROP INDEX idx_student_city ON students;

-- G5: Transaction with ROLLBACK (Demonstrating rollback preserves original data).
START TRANSACTION;

-- Update marks of student 101 in course 201 to 100
UPDATE enrollments 
SET marks = 100 
WHERE student_id = 101 AND course_id = 201;

-- Verify updated value inside the transaction:
SELECT * FROM enrollments WHERE student_id = 101 AND course_id = 201;

-- Rollback the transaction:
ROLLBACK;

-- Confirm value reverted to original (88):
SELECT * FROM enrollments WHERE student_id = 101 AND course_id = 201;

-- G6: Transaction with COMMIT (Demonstrating commit persists changes permanently).
START TRANSACTION;

-- Update marks of student 101 in course 201 to 100
UPDATE enrollments 
SET marks = 100 
WHERE student_id = 101 AND course_id = 201;

-- Commit the transaction:
COMMIT;

-- Confirm the change is permanent:
SELECT * FROM enrollments WHERE student_id = 101 AND course_id = 201;


-- ============================================================================
-- PART H: CHALLENGE PROBLEMS (OPTIONAL)
-- ============================================================================

-- H1: Display a rank list of students by their total marks, with ties handled 
--     using RANK() or DENSE_RANK().
SELECT 
    s.student_id, 
    s.name AS student_name, 
    SUM(e.marks) AS total_marks,
    RANK() OVER (ORDER BY SUM(e.marks) DESC) AS `rank`,
    DENSE_RANK() OVER (ORDER BY SUM(e.marks) DESC) AS `dense_rank`
FROM students s 
INNER JOIN enrollments e ON s.student_id = e.student_id 
GROUP BY s.student_id, s.name 
ORDER BY `rank`;

-- H2: Assign a grade to each enrollment using CASE:
--     90 and above = A, 75 to 89 = B, 60 to 74 = C, below 60 = D.
SELECT 
    s.name AS student_name,
    c.title AS course_title,
    e.marks,
    CASE 
        WHEN e.marks >= 90 THEN 'A'
        WHEN e.marks >= 75 THEN 'B'
        WHEN e.marks >= 60 THEN 'C'
        ELSE 'D'
    END AS grade
FROM enrollments e 
INNER JOIN students s ON e.student_id = s.student_id 
INNER JOIN courses c  ON e.course_id = c.course_id;

-- H3: Find pairs of students from the same city (self join).
-- Using s1.student_id < s2.student_id prevents duplicate pairs (A, B) and (B, A),
-- as well as pairing a student with themselves (A, A).
SELECT 
    s1.name AS student_1, 
    s2.name AS student_2, 
    s1.city 
FROM students s1 
INNER JOIN students s2 
    ON s1.city = s2.city 
    AND s1.student_id < s2.student_id;

-- H4: Find the second highest marks in the enrollments table without using LIMIT.
SELECT MAX(marks) AS second_highest_marks 
FROM enrollments 
WHERE marks < (SELECT MAX(marks) FROM enrollments);

-- ============================================================================
-- END OF LAB SHEET - 7 SOLUTION
-- ============================================================================
