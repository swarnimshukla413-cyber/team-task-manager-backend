const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create Project
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Project name is required" });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        ownerId: 1 // temp user
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
      where: { ownerId: 1 }
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;