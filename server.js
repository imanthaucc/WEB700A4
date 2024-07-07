const express = require('express');
const path = require('path');
const collegeData = require('./collegeData');  // Adjust path as needed

// Require body-parser
const bodyParser = require('body-parser');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Route to serve about.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to serve htmlDemo.html
app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

// Route to serve addStudent.html
app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

// Route to get all students or students by course
app.get('/students', (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: "no results" }));
    }
});

// Route to get all TAs
app.get('/tas', (req, res) => {
    collegeData.getTAs()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: "no results" }));
});

// Route to get all courses
app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: "no results" }));
});

// Route to get student by using studentNum
app.get('/student/:num', (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: "no results" }));
});

// Route to add a new student (POST method)
app.post('/students/add', (req, res) => {
    const newStudent = req.body;
    collegeData.addStudent(newStudent)
        .then(() => {
            res.redirect('/students');
        })
        .catch(err => {
            console.error(`Failed to add student: ${err}`);
            res.status(500).send("Failed to add student");
        });
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Initialize collegeData and start server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error(`Unable to initialize collegeData: ${err}`);
    });
