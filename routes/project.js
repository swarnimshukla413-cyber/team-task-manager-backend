const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth"); // keep this simple

const prisma = new PrismaClient();
const router = express.Router();

// Create Project
router.post("/", auth, async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        ownerId: req.user.id
      }
    });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get Projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.id }
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;