import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// create
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// read all
router.get("/", async (req, res) => {
  try {
    const student = await Student.find();
    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// read one
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.json(student)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

export default router;