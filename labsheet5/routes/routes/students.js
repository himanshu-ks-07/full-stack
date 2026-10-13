const express = require('express');
const router = express.Router();

// GET /api/students/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, message: "Student details" });
});

module.exports = router;