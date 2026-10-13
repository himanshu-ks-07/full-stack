const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: "Node.js Guide", author: "John Doe" },
  { id: 2, title: "Express Deep Dive", author: "Jane Smith" }
];

// GET /api/books
router.get('/', (req, res) => {
  res.json(books);
});

// GET /api/books/:id
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    return next(error);
  }
  res.json(book);
});

// POST /api/books
router.post('/', (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /api/books/:id
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    const error = new Error("Book not found for update");
    error.status = 404;
    return next(error);
  }
  books[bookIndex] = { id, ...req.body };
  res.json(books[bookIndex]);
});

// DELETE /api/books/:id
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    const error = new Error("Book not found for deletion");
    error.status = 404;
    return next(error);
  }
  const deletedBook = books.splice(bookIndex, 1);
  res.json({ message: "Book deleted successfully", book: deletedBook[0] });
});

module.exports = router;