const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create Project
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    // ✅ Check if user exists
    let user = await prisma.user.findUnique({
      where: { id: 1 }
    });

    // ✅ Create user if not exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@test.com",
          password: "dummy"
        }
      });
    }

    // ✅ Create project
    const project = await prisma.project.create({
      data: {
        name,
        ownerId: user.id
      }
    });

    res.json(project);

  } catch (err) {
    console.error("PROJECT ERROR:", err);
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
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;