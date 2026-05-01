const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

// ✅ CREATE PROJECT (ADMIN ONLY)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admin can create projects" });
    }

    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        ownerId: req.user.id,
      },
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET PROJECTS (ONLY USER'S PROJECTS)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.id },
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;