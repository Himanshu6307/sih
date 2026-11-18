import Subject from "../models/admin/subject.model.js";

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    // 1. DB se saare subjects fetch karo
    const subjects = await Subject.find();

    // 2. Agar subjects empty hain
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subjects found",
      });
    }

    // 3. Success response
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
