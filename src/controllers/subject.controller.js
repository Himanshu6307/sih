// controllers/subject.controller.js
import Subject from "../models/admin/subject.model.js";

export const addSubject = async (req, res) => {
  try {
    const { name, code, type, credits} = req.body;

    // 1. Validation (koi bhi required field empty na ho)
    if (!name || !code || !credits || !type) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // 2. Check if subject code already exists
    const existing = await Subject.findOne({ code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Subject code already exists",
      });
    }

    // 3. Create and Save using .create()
    const subject = await Subject.create({
      name,
      code,
      type,
      credits,
    });

    // 4. Success response
    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
