const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// CENTRAL IN-MEMORY DATABASE
const db = {
    students: {
        "9876543210": { mobile: "9876543210", name: "Rahul Sharma", roll: "BT202301", att: 88, fee: "Paid", dbms: 88, java: 92, skills: "C++, Java, React", projects: "Automated Timetable App", ticket: "Need extension on DBMS lab report submission." },
        "9876543211": { mobile: "9876543211", name: "Priya Patel", roll: "BT202302", att: 94, fee: "Unpaid", dbms: 95, java: 91, skills: "Python, AI, Data Science", projects: "Attendance QR Token System", ticket: "Issue accessing digital library." },
        "9876543212": { mobile: "9876543212", name: "Amit Kumar", roll: "BT202303", att: 78, fee: "Unpaid", dbms: 76, java: 81, skills: "Node.js, Express, SQL", projects: "Student Management System", ticket: "None" }
    },
    faculty: [
        { id: "F101", name: "Dr. Robert Smith", department: "Computer Science", subject: "DBMS", email: "robert.smith@college.edu" },
        { id: "F102", name: "Prof. Elena Ray", department: "AI & ML", subject: "Artificial Intelligence", email: "elena.ray@college.edu" }
    ],
    notices: [
        "📢 Semester 7 Timetable Released",
        "📢 B.Tech Campus Recruitment Registration Open"
    ]
};

// API ENDPOINTS

// 1. Authentication Route
app.post('/api/login', (req, res) => {
    const { role, mobile, password } = req.body;

    if (role === 'student') {
        if (password !== 'camu12') return res.status(401).json({ error: 'Invalid Student Password (camu12)' });
        const student = db.students[mobile];
        if (!student) return res.status(404).json({ error: 'Student mobile not found' });
        return res.json({ success: true, role: 'student', user: student });
    }

    if (role === 'faculty') {
        if (password !== 'faculty123') return res.status(401).json({ error: 'Invalid Faculty Password (faculty123)' });
        return res.json({ success: true, role: 'faculty' });
    }

    if (role === 'admin') {
        if (password !== 'admin123') return res.status(401).json({ error: 'Invalid Admin Password (admin123)' });
        return res.json({ success: true, role: 'admin' });
    }

    res.status(400).json({ error: 'Invalid Role' });
});

// 2. Fetch Data Endpoints
app.get('/api/data', (req, res) => {
    res.json(db);
});

// 3. Update Student Marks (Faculty Action)
app.post('/api/faculty/update-marks', (req, res) => {
    const { mobile, dbms, java } = req.body;
    if (db.students[mobile]) {
        db.students[mobile].dbms = parseInt(dbms);
        db.students[mobile].java = parseInt(java);
        return res.json({ success: true, student: db.students[mobile] });
    }
    res.status(404).json({ error: 'Student not found' });
});

// 4. Update Student Attendance (Faculty Action)
app.post('/api/faculty/mark-attendance', (req, res) => {
    const { mobile } = req.body;
    if (db.students[mobile]) {
        db.students[mobile].att = Math.min(100, db.students[mobile].att + 1);
        return res.json({ success: true, newAttendance: db.students[mobile].att });
    }
    res.status(404).json({ error: 'Student not found' });
});

// 5. Post Campus Notice (Faculty/Admin Action)
app.post('/api/notices/add', (req, res) => {
    const { notice } = req.body;
    if (notice) {
        db.notices.unshift(`📢 ${notice}`);
        return res.json({ success: true, notices: db.notices });
    }
    res.status(400).json({ error: 'Empty notice' });
});

// 6. Pay Student Fees (Student Action)
app.post('/api/student/pay-fee', (req, res) => {
    const { mobile } = req.body;
    if (db.students[mobile]) {
        db.students[mobile].fee = "Paid";
        return res.json({ success: true });
    }
    res.status(404).json({ error: 'Student not found' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
