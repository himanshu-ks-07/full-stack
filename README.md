# Lab Sheet 7 - Complete Database Solution Guide

यह प्रोजेक्ट **Lab Sheet 7** के सभी सवालों (Part A से Part H) का संपूर्ण समाधान प्रदान करता है।

मुख्य SQL फाइल: [`LabSheet7_Solution.sql`](./LabSheet7_Solution.sql)

---

## 🚀 VS Code में कैसे चलाएं (How to Run in VS Code)

आप इस फाइल को VS Code में निम्नलिखित आसान तरीकों से चला सकते हैं:

### तरीका 1: VS Code Terminal के जरिए (सबसे सीधा तरीका)

1. **VS Code** में टर्मिनल खोलें (`Ctrl + ~` या `Terminal -> New Terminal`).
2. अगर आपके सिस्टम पर **MySQL** इंस्टॉल है, तो कमांड रन करें:
   ```bash
   mysql -u root -p < LabSheet7_Solution.sql
   ```
   *(पासवर्ड मांगे जाने पर अपना MySQL root पासवर्ड डालें)*

3. या फिर MySQL शेल में लॉगिन करके रन करें:
   ```bash
   mysql -u root -p
   ```
   फिर SQL प्रॉम्प्ट में लिखें:
   ```sql
   SOURCE LabSheet7_Solution.sql;
   ```

---

### तरीका 2: VS Code Extension का उपयोग करके (Interactive Execution)

1. VS Code के Extensions टैब (`Ctrl + Shift + X`) में जाएं।
2. **"MySQL"** (by Weihan Chen) या **"SQLTools"** इंस्टॉल करें।
3. अपने स्थानीय डेटाबेस (Localhost:3306) से कनेक्ट करें।
4. [`LabSheet7_Solution.sql`](./LabSheet7_Solution.sql) फाइल को खोलें।
5. जिस क्वेरी को चलाना हो, उसे सेलेक्ट करें और राइट-क्लिक करके **Run Selected Query** दबाएं या शॉर्टकट (`Ctrl + Enter`) दबाएं।

---

## 📋 विस्तृत समाधान एवं व्याख्या (Solutions & Explanations)

### Setup & Initial Check
- डेटाबेस: `college_db`
- टेबल्स: `departments`, `students`, `courses`, `enrollments`
- 8 स्टूडेंट्स, 4 डिपार्टमेंट्स, 5 कोर्सेस और 11 एनरोलमेंट्स का डेटा इन्सर्ट किया गया है।

---

### Part A: DDL (Data Definition Language)
- **A1**: `faculty` टेबल बनाई गई जिसमें `faculty_id` (PK), `name` (NOT NULL), `email` (UNIQUE), `salary`, और `dept_id` (FK) शामिल हैं।
- **A2**: `ALTER TABLE faculty ADD phone VARCHAR(15);` द्वारा नया कॉलम जोड़ा गया।
- **A3**: `ALTER TABLE faculty RENAME COLUMN phone TO contact_no;` द्वारा नाम बदला गया।
- **A4**: `ALTER TABLE faculty DROP COLUMN contact_no;` द्वारा कॉलम हटाया गया।
- **A5**: `DROP TABLE faculty;` द्वारा टेबल को पूरी तरह डिलीट किया गया।

#### 💡 A5 Explanation: DROP vs TRUNCATE vs DELETE
| गुण | DELETE | TRUNCATE | DROP |
| :--- | :--- | :--- | :--- |
| **प्रकार (Type)** | DML (Data Manipulation) | DDL (Data Definition) | DDL (Data Definition) |
| **कंडीशन (WHERE)** | इस्तेमाल कर सकते हैं (चुनिंदा रिकॉर्ड्स हटाने के लिए) | इस्तेमाल नहीं कर सकते (पूरा डेटा साफ होता है) | लागू नहीं |
| **रोलबैक (Rollback)** | Transaction में Rollback संभव है | अधिकांश DBs में Rollback संभव नहीं | Rollback नहीं किया जा सकता |
| **टेबल का स्ट्रक्चर** | वैसा ही रहता है | वैसा ही रहता है | पूरा स्ट्रक्चर ही डिलीट हो जाता है |
| **स्पीड (Speed)** | धीमी (हर रो का लॉग बनता है) | बहुत तेज़ (पेज डी-एलोकेट करता है) | बहुत तेज़ |

---

### Part B: DML (Data Manipulation Language)
- **B1**: नया स्टूडेंट Neha (ID: 109) जोड़ा गया।
- **B2**: बिना City के स्टूडेंट जोड़ा गया -> **Observation**: डिफॉल्ट रूप से `city` में `NULL` स्टोर होता है।
- **B3**: स्टूडेंट 105 का शहर 'Roorkee' अपडेट किया गया।
- **B4**: कोर्स 203 के सभी स्टूडेंट्स के मार्क्स +5 किए गए।
- **B5**: टेस्टिंग वाले स्टूडेंट्स (109 & 110) को `DELETE` किया गया।
- **B6**: 15 साल की उम्र इन्सर्ट करने पर त्रुटि (Error) आती है:
  - **कारण**: टेबल में `age INT CHECK (age >= 17)` कंस्ट्रेंट लगा है। 15 उम्र 17 से कम होने के कारण CHECK constraint violate हो जाता है।

---

### Part C: Querying with SELECT
- `SELECT *`, `SELECT columns`, `WHERE city = 'Roorkee'`
- `BETWEEN 20 AND 22`, `IN ('Roorkee', 'Dehradun')`, `LIKE 'A%'`
- `IS NULL` (जिन्हें डिपार्टमेंट नहीं मिला)
- `DISTINCT city` (बिना डुप्लीकेट शहर)
- `ORDER BY age DESC, name ASC`
- `LIMIT 3` (टॉप 3 सबसे उम्रदराज़ छात्र)
- Aliases: `AS 'Student Name'`, `AS 'Age'`

---

### Part D: Functions and Aggregation
- **D1 - D7**: `COUNT(*)`, `AVG()`, `MIN()`, `MAX()`, `GROUP BY`, `HAVING COUNT(*) > 1`, `SUM(credits)`, `UPPER()`, `LENGTH()`.
- **D8 Explanation**:
  - `WHERE` क्लॉज ग्रुपिंग होने से **पहले** काम करता है (Row-level filtering)। इस समय aggregate वैल्यू मौजूद नहीं होती।
  - `HAVING` क्लॉज `GROUP BY` होने के **बाद** समरी/एग्रीगेट वैल्यूज को फ़िल्टर करने के लिए उपयोग किया जाता है।

---

### Part E: Joins
- **E1**: `INNER JOIN` (केवल मैच होने वाले छात्र और उनके विभाग)।
- **E2**: `LEFT JOIN` -> छात्र **Vikram** (ID: 107) का विभाग `NULL` दिखता है क्योंकि उसका `dept_id` NULL है।
- **E3**: `RIGHT JOIN` -> विभाग **Civil** दिखता है और छात्र का नाम `NULL` आता है क्योंकि Civil में कोई छात्र नामांकित नहीं है।
- **E4**: `students`, `enrollments`, और `courses` को 3-वे जॉइन करके रिपोर्ट दिखाना।
- **E5**: 'Data Structures' में नामांकित छात्रों के नाम।
- **E6**: किसी भी कोर्स में नामांकित न होने वाले छात्र (`LEFT JOIN ... WHERE e.course_id IS NULL`) -> **Vikram**।
- **E7**: हर कोर्स के नामांकित छात्रों की संख्या (शून्य नामांकन वाले कोर्स सहित)।
- **E8**: प्रत्येक विभाग के कुल छात्र एवं औसत उम्र।

---

### Part F: Subqueries
- **F1**: औसत उम्र से बड़े छात्र (`WHERE age > (SELECT AVG(age)...)`).
- **F2**: अधिकतम अंक लाने वाले छात्र (`WHERE marks = (SELECT MAX(marks)...)`).
- **F3**: कम से कम एक नामांकन वाले कोर्स (`IN` और `EXISTS`).
- **F4**: 2 से अधिक कोर्स में नामांकित छात्र (`HAVING COUNT(course_id) > 2`).
- **F5**: सबसे अधिक छात्रों वाला विभाग।
- **F6**: कोर्स के औसत से अधिक अंक लाने वाले छात्रों की सूची (Correlated Subquery)।

---

### Part G: Indexes, Views and Transactions
- **G1**: `CREATE INDEX idx_student_city ON students(city);`
  - `EXPLAIN` चलाने पर क्वेरी स्कैन टाइप `ALL` से बदलकर `ref` हो जाता है, जिससे परफॉरमेंस कई गुना तेज़ हो जाती है।
- **G2 - G4**: View `student_marks` बनाना, क्वेरी करना, और View तथा Index को DROP करना।
- **G5**: `START TRANSACTION; ... ROLLBACK;` -> बदलाव वापस मूल स्थिति (88) में आ जाता है।
- **G6**: `START TRANSACTION; ... COMMIT;` -> बदलाव स्थायी (100) रूप से सुरक्षित हो जाता है।

---

### Part H: Challenge Problems
- **H1**: `RANK()` और `DENSE_RANK()` विंडो फंक्शन्स का उपयोग कर छात्रों की मेरिट लिस्ट।
- **H2**: `CASE` एक्सप्रेशन द्वारा ग्रेड (A, B, C, D) आवंटित करना।
- **H3**: Self-Join द्वारा एक ही शहर के छात्रों के जोड़े (Pairs) निकालना।
- **H4**: बिना `LIMIT` के दूसरा सबसे बड़ा अंक (Second Highest Marks) प्राप्त करना।
