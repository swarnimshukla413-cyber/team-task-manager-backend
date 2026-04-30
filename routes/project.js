const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth"); // keep this simple

const prisma = new PrismaClient();
const router = express.Router();

// Create Project
router.post("/", async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        ownerId:1
      }
    });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get Projects
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId:1 }
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;