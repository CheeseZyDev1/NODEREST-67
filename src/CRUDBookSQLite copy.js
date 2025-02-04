const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

// Connect to the database
const db = new sqlite3.Database('./database/Book.sqlite');

// Parse incoming requests
app.use(express.json());

// Create book table if it does not exist
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT, 
    author TEXT,
    year INTEGER DEFAULT 0
)`);

// Route to get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

// Route to get a book by ID
app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
        }
    });
});

// Route to create a new book
app.post('/books', (req, res) => {
    const book = req.body;
    const year = book.year || new Date().getFullYear(); // ถ้าไม่มีค่า year ให้ใช้ปีปัจจุบัน
    db.run('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', 
           [book.title, book.author, year], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            book.year = year; // เพิ่ม year กลับไปใน response
            res.send(book);
        }
    });
});

// Route to update a book
app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?', 
           [book.title, book.author, book.year || new Date().getFullYear(), req.params.id], (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });
});

// Route to delete a book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
