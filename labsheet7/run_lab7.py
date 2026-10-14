"""
LAB SHEET - 7 : AUTOMATED PYTHON RUNNER (ZERO PASSWORD / ZERO SETUP)
This script runs all queries of Lab Sheet 7 directly in VS Code using built-in SQLite.
NO MySQL server or password required! Just click the 'Play' button or run:
    python run_lab7.py
"""

import sqlite3
import sys

def print_section(title):
    print("\n" + "=" * 70)
    print(f" {title} ")
    print("=" * 70)

def print_result(cursor, query_name):
    print(f"\n--- [ {query_name} ] ---")
    rows = cursor.fetchall()
    if not rows:
        print("(Query executed successfully. 0 rows returned)")
        return
    
    col_names = [desc[0] for desc in cursor.description]
    widths = [len(col) for col in col_names]
    for row in rows:
        for idx, val in enumerate(row):
            widths[idx] = max(widths[idx], len(str(val) if val is not None else "NULL"))
    
    header = " | ".join(col.ljust(widths[i]) for i, col in enumerate(col_names))
    divider = "-+-".join("-" * widths[i] for i in range(len(col_names)))
    print(header)
    print(divider)
    for row in rows:
        row_str = " | ".join(str(val if val is not None else "NULL").ljust(widths[i]) for i, val in enumerate(row))
        print(row_str)

def main():
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    print_section("STEP 0: CREATING TABLES & INSERTING DATA")
    
    cursor.executescript("""
    CREATE TABLE departments (
        dept_id   INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE students (
        student_id INTEGER PRIMARY KEY,
        name       TEXT NOT NULL,
        age        INTEGER CHECK (age >= 17),
        city       TEXT,
        dept_id    INTEGER,
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
    );

    CREATE TABLE courses (
        course_id INTEGER PRIMARY KEY,
        title     TEXT NOT NULL,
        credits   INTEGER DEFAULT 3,
        dept_id   INTEGER,
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
    );

    CREATE TABLE enrollments (
        student_id INTEGER,
        course_id  INTEGER,
        marks      INTEGER,
        PRIMARY KEY (student_id, course_id),
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (course_id)  REFERENCES courses(course_id)
    );

    INSERT INTO departments VALUES (1,'CSE'),(2,'ECE'),(3,'Mechanical'),(4,'Civil');

    INSERT INTO students VALUES
    (101,'Aarav',20,'Roorkee',1),
    (102,'Diya',21,'Dehradun',1),
    (103,'Kabir',19,'Haridwar',2),
    (104,'Meera',22,'Roorkee',1),
    (105,'Rohan',20,'Delhi',3),
    (106,'Sana',21,'Dehradun',2),
    (107,'Vikram',23,'Jaipur',NULL),
    (108,'Isha',19,'Roorkee',2);

    INSERT INTO courses VALUES
    (201,'Data Structures',4,1),
    (202,'Operating Systems',4,1),
    (203,'Digital Electronics',3,2),
    (204,'Thermodynamics',3,3),
    (205,'Machine Learning',4,1);

    INSERT INTO enrollments VALUES
    (101,201,88),(101,202,76),(101,205,91),
    (102,201,67),(102,205,72),
    (103,203,81),
    (104,201,95),(104,202,89),
    (105,204,58),
    (106,203,74),
    (108,203,66);
    """)
    
    cursor.execute("SELECT * FROM students;")
    print_result(cursor, "Initial Check: 8 Students Inserted")

    # PART A
    print_section("PART A: DDL (DATA DEFINITION LANGUAGE)")
    cursor.execute("""
    CREATE TABLE faculty (
        faculty_id INTEGER PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT UNIQUE,
        salary     REAL,
        dept_id    INTEGER,
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
    );
    """)
    print("A1: Table 'faculty' created.")
    cursor.execute("ALTER TABLE faculty ADD COLUMN phone TEXT;")
    print("A2: Column 'phone' added to faculty.")
    cursor.execute("ALTER TABLE faculty RENAME COLUMN phone TO contact_no;")
    print("A3: Column renamed to 'contact_no'.")
    cursor.execute("ALTER TABLE faculty DROP COLUMN contact_no;")
    print("A4: Column 'contact_no' dropped.")
    cursor.execute("DROP TABLE faculty;")
    print("A5: Table 'faculty' dropped completely.")

    # PART B
    print_section("PART B: DML (DATA MANIPULATION LANGUAGE)")
    cursor.execute("INSERT INTO students VALUES (109, 'Neha', 20, 'Roorkee', 1);")
    print("B1: Inserted student 109 ('Neha').")
    cursor.execute("INSERT INTO students (student_id, name, age, dept_id) VALUES (110, 'Amit', 21, 2);")
    cursor.execute("SELECT * FROM students WHERE student_id = 110;")
    print_result(cursor, "B2 Observation: Value stored for city is NULL")
    cursor.execute("UPDATE students SET city = 'Roorkee' WHERE student_id = 105;")
    cursor.execute("SELECT * FROM students WHERE student_id = 105;")
    print_result(cursor, "B3: Updated student 105 city to Roorkee")
    cursor.execute("UPDATE enrollments SET marks = marks + 5 WHERE course_id = 203;")
    cursor.execute("SELECT * FROM enrollments WHERE course_id = 203;")
    print_result(cursor, "B4: Marks increased by 5 for course 203")
    cursor.execute("DELETE FROM students WHERE student_id IN (109, 110);")
    print("B5: Test students (109, 110) deleted.")

    try:
        cursor.execute("INSERT INTO students VALUES (111, 'Chirag', 15, 'Delhi', 1);")
    except sqlite3.IntegrityError as e:
        print(f"B6 Result: Successfully caught constraint error -> {e}")
        print("   Explanation: CHECK (age >= 17) prevents age 15 from being inserted.")

    # PART C
    print_section("PART C: QUERYING WITH SELECT")
    cursor.execute("SELECT * FROM students;")
    print_result(cursor, "C1: All columns of all students")
    cursor.execute("SELECT name, city FROM students;")
    print_result(cursor, "C2: Name and city of all students")
    cursor.execute("SELECT * FROM students WHERE city = 'Roorkee';")
    print_result(cursor, "C3: Students from Roorkee")
    cursor.execute("SELECT * FROM students WHERE age BETWEEN 20 AND 22;")
    print_result(cursor, "C4: Students aged between 20 and 22")
    cursor.execute("SELECT * FROM students WHERE city IN ('Roorkee', 'Dehradun');")
    print_result(cursor, "C5: Students from Roorkee or Dehradun")
    cursor.execute("SELECT * FROM students WHERE name LIKE 'A%';")
    print_result(cursor, "C6: Students whose name starts with 'A'")
    cursor.execute("SELECT * FROM students WHERE dept_id IS NULL;")
    print_result(cursor, "C7: Students with no department assigned")
    cursor.execute("SELECT DISTINCT city FROM students;")
    print_result(cursor, "C8: Distinct cities")
    cursor.execute("SELECT * FROM students ORDER BY age DESC, name ASC;")
    print_result(cursor, "C9: Sorted by age DESC, name ASC")
    cursor.execute("SELECT * FROM students ORDER BY age DESC LIMIT 3;")
    print_result(cursor, "C10: Top 3 oldest students")
    cursor.execute('SELECT name AS "Student Name", age AS "Age" FROM students;')
    print_result(cursor, "C11: Aliases (Student Name, Age)")

    # PART D
    print_section("PART D: FUNCTIONS AND AGGREGATION")
    cursor.execute("SELECT COUNT(*) AS total_students FROM students;")
    print_result(cursor, "D1: Total number of students")
    cursor.execute("SELECT AVG(marks) AS average_marks, MIN(marks) AS min_marks, MAX(marks) AS max_marks FROM enrollments;")
    print_result(cursor, "D2: Avg, Min, Max marks in enrollments")
    cursor.execute("SELECT city, COUNT(*) AS student_count FROM students GROUP BY city;")
    print_result(cursor, "D3: Student count in each city")
    cursor.execute("SELECT course_id, AVG(marks) AS avg_marks FROM enrollments GROUP BY course_id;")
    print_result(cursor, "D4: Average marks for each course")
    cursor.execute("SELECT city, COUNT(*) AS student_count FROM students GROUP BY city HAVING COUNT(*) > 1;")
    print_result(cursor, "D5: Cities with more than one student")
    cursor.execute("SELECT dept_id, SUM(credits) AS total_credits FROM courses GROUP BY dept_id;")
    print_result(cursor, "D6: Total credits by department")
    cursor.execute("SELECT name, UPPER(name) AS upper_name, LENGTH(name) AS name_len FROM students;")
    print_result(cursor, "D7: UPPER(name) and LENGTH(name)")

    # PART E
    print_section("PART E: JOINS")
    cursor.execute("""
    SELECT s.name AS student_name, d.dept_name 
    FROM students s 
    INNER JOIN departments d ON s.dept_id = d.dept_id;
    """)
    print_result(cursor, "E1: Student name with department (INNER JOIN)")

    cursor.execute("""
    SELECT s.name AS student_name, d.dept_name 
    FROM students s 
    LEFT JOIN departments d ON s.dept_id = d.dept_id;
    """)
    print_result(cursor, "E2: All students including without dept (LEFT JOIN -> Vikram shows NULL)")

    cursor.execute("""
    SELECT d.dept_name, s.name AS student_name 
    FROM departments d 
    LEFT JOIN students s ON d.dept_id = s.dept_id;
    """)
    print_result(cursor, "E3: All departments including no students (Civil has NULL)")

    cursor.execute("""
    SELECT s.name AS student_name, c.title AS course_title, e.marks 
    FROM students s 
    INNER JOIN enrollments e ON s.student_id = e.student_id 
    INNER JOIN courses c ON e.course_id = c.course_id;
    """)
    print_result(cursor, "E4: Student name, course title and marks (3-way JOIN)")

    cursor.execute("""
    SELECT DISTINCT s.name 
    FROM students s 
    INNER JOIN enrollments e ON s.student_id = e.student_id 
    INNER JOIN courses c ON e.course_id = c.course_id 
    WHERE c.title = 'Data Structures';
    """)
    print_result(cursor, "E5: Students enrolled in 'Data Structures'")

    cursor.execute("""
    SELECT s.student_id, s.name 
    FROM students s 
    LEFT JOIN enrollments e ON s.student_id = e.student_id 
    WHERE e.course_id IS NULL;
    """)
    print_result(cursor, "E6: Students not enrolled in any course (Vikram)")

    cursor.execute("""
    SELECT c.course_id, c.title, COUNT(e.student_id) AS total_enrolled 
    FROM courses c 
    LEFT JOIN enrollments e ON c.course_id = e.course_id 
    GROUP BY c.course_id, c.title;
    """)
    print_result(cursor, "E7: Number of students enrolled in each course")

    cursor.execute("""
    SELECT d.dept_id, d.dept_name, COUNT(s.student_id) AS student_count, AVG(s.age) AS avg_age 
    FROM departments d 
    LEFT JOIN students s ON d.dept_id = s.dept_id 
    GROUP BY d.dept_id, d.dept_name;
    """)
    print_result(cursor, "E8: Department student count and average age")

    # PART F
    print_section("PART F: SUBQUERIES")
    cursor.execute("SELECT * FROM students WHERE age > (SELECT AVG(age) FROM students);")
    print_result(cursor, "F1: Students older than average age")

    cursor.execute("""
    SELECT s.student_id, s.name, e.course_id, e.marks 
    FROM students s 
    INNER JOIN enrollments e ON s.student_id = e.student_id 
    WHERE e.marks = (SELECT MAX(marks) FROM enrollments);
    """)
    print_result(cursor, "F2: Student(s) with highest marks")

    cursor.execute("SELECT * FROM courses WHERE course_id IN (SELECT DISTINCT course_id FROM enrollments);")
    print_result(cursor, "F3: Courses with at least one enrollment")

    cursor.execute("""
    SELECT * FROM students 
    WHERE student_id IN (
        SELECT student_id FROM enrollments GROUP BY student_id HAVING COUNT(course_id) > 2
    );
    """)
    print_result(cursor, "F4: Students enrolled in more than 2 courses")

    cursor.execute("""
    SELECT d.dept_id, d.dept_name, COUNT(s.student_id) AS student_count 
    FROM departments d 
    INNER JOIN students s ON d.dept_id = s.dept_id 
    GROUP BY d.dept_id, d.dept_name 
    HAVING COUNT(s.student_id) = (
        SELECT MAX(dept_count) 
        FROM (SELECT COUNT(student_id) AS dept_count FROM students WHERE dept_id IS NOT NULL GROUP BY dept_id)
    );
    """)
    print_result(cursor, "F5: Department with highest number of students")

    cursor.execute("""
    SELECT c.title AS course_title, s.name AS student_name, e.marks
    FROM enrollments e
    INNER JOIN students s ON e.student_id = s.student_id
    INNER JOIN courses c ON e.course_id = c.course_id
    WHERE e.marks > (SELECT AVG(e2.marks) FROM enrollments e2 WHERE e2.course_id = e.course_id);
    """)
    print_result(cursor, "F6: Students scoring above that course's average (Correlated)")

    # PART G
    print_section("PART G: INDEXES, VIEWS AND TRANSACTIONS")
    cursor.execute("CREATE INDEX idx_student_city ON students(city);")
    print("G1: Index 'idx_student_city' created on students(city).")

    cursor.execute("""
    CREATE VIEW student_marks AS 
    SELECT s.name AS student_name, c.title AS course_title, e.marks 
    FROM students s 
    INNER JOIN enrollments e ON s.student_id = e.student_id 
    INNER JOIN courses c ON e.course_id = c.course_id;
    """)
    print("G2: View 'student_marks' created.")

    cursor.execute("SELECT * FROM student_marks WHERE marks > 80;")
    print_result(cursor, "G3: Query view for marks > 80")

    cursor.execute("DROP VIEW student_marks;")
    cursor.execute("DROP INDEX idx_student_city;")
    print("G4: View and Index dropped.")

    print("\nG5: Running Transaction with ROLLBACK...")
    cursor.execute("SELECT marks FROM enrollments WHERE student_id = 101 AND course_id = 201;")
    orig_marks = cursor.fetchone()[0]
    print(f"   Original marks: {orig_marks}")
    cursor.execute("SAVEPOINT sp1;")
    cursor.execute("UPDATE enrollments SET marks = 100 WHERE student_id = 101 AND course_id = 201;")
    cursor.execute("SELECT marks FROM enrollments WHERE student_id = 101 AND course_id = 201;")
    print(f"   Marks during transaction: {cursor.fetchone()[0]}")
    cursor.execute("ROLLBACK TO sp1;")
    cursor.execute("SELECT marks FROM enrollments WHERE student_id = 101 AND course_id = 201;")
    print(f"   Marks after ROLLBACK: {cursor.fetchone()[0]} (Unchanged!)")

    # PART H
    print_section("PART H: CHALLENGE PROBLEMS")
    cursor.execute("""
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
    """)
    print_result(cursor, "H1: Rank list using RANK() and DENSE_RANK()")

    cursor.execute("""
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
    """)
    print_result(cursor, "H2: Grade assignment using CASE")

    cursor.execute("""
    SELECT s1.name AS student_1, s2.name AS student_2, s1.city 
    FROM students s1 
    INNER JOIN students s2 ON s1.city = s2.city AND s1.student_id < s2.student_id;
    """)
    print_result(cursor, "H3: Pairs of students from the same city (Self Join)")

    cursor.execute("""
    SELECT MAX(marks) AS second_highest_marks 
    FROM enrollments 
    WHERE marks < (SELECT MAX(marks) FROM enrollments);
    """)
    print_result(cursor, "H4: Second highest marks without LIMIT")

    print_section("ALL EXERCISES (A to H) EXECUTED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
