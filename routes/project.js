const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create Project
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    // 🔴 Validate input (important)
    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    // ✅ Ensure user exists
    let user = await prisma.user.findUnique({
      where: { id: 1 }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 1,
          name: "Test User",        // ✅ REQUIRED FIX
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
    console.error("FETCH PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;