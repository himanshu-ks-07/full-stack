const express = require('express');
const router = express.Router();

let members = [
  { id: 1, name: "Rahul Sharma", role: "Student" },
  { id: 2, name: "Priya Singh", role: "Faculty" }
];

// GET /api/members
router.get('/', (req, res) => {
  res.json(members);
});

// GET /api/members/:id
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const member = members.find(m => m.id === id);
  if (!member) {
    const error = new Error("Member not found");
    error.status = 404;
    return next(error);
  }
  res.json(member);
});

// POST /api/members
router.post('/', (req, res) => {
  const { name, role } = req.body;
  const newMember = { id: members.length + 1, name, role };
  members.push(newMember);
  res.status(201).json(newMember);
});

// PUT /api/members/:id
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const memberIndex = members.findIndex(m => m.id === id);
  if (memberIndex === -1) {
    const error = new Error("Member not found for update");
    error.status = 404;
    return next(error);
  }
  members[memberIndex] = { id, ...req.body };
  res.json(members[memberIndex]);
});

// DELETE /api/members/:id
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const memberIndex = members.findIndex(m => m.id === id);
  if (memberIndex === -1) {
    const error = new Error("Member not found for deletion");
    error.status = 404;
    return next(error);
  }
  const deletedMember = members.splice(memberIndex, 1);
  res.json({ message: "Member deleted successfully", member: deletedMember[0] });
});

module.exports = router;