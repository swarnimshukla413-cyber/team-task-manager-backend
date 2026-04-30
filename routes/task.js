const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create Task
router.post("/", async (req, res) => {
  const { title, dueDate, projectId } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        projectId,
        assignedTo: 1 // TEMP user id
      }
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put("/:id", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;