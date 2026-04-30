const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

// Create Task
router.post("/", auth, async (req, res) => {
  const { title, dueDate, projectId, assignedTo } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        projectId,
        assignedTo: req.user.id
      }
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: { status: req.body.status }
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assignedTo: req.user.id }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;