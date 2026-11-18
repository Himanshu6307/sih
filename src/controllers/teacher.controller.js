// import Teacher from "../models/admin/teacher.model.js";

// // Add a new teacher
// export const addTeacher = async (req, res) => {
//   try {
//     const { employeeId ,name, subjects } = req.body;

//     // 🔎 Required field validation
//     if (!employeeId ||!name || !subjects || subjects.length === 0) {
//       return res.status(400).json({
//         status: false,
//         message: "Name and at least one subject are required."
//       });
//     }

//     // if (!maxHoursPerWeek) {
//     //   return res.status(400).json({
//     //     status: false,
//     //     message: "Max hours per week is required."
//     //   });
//     // }

//     // 💾 Save directly using create()
//     const savedTeacher = await Teacher.create({
//       name,
//       subjects,
//       employeeId
//     });

//     // ✅ Success response
//     return res.status(201).json({
//       status: true,
//       message: "Teacher created successfully",
//       data: savedTeacher
//     });
//   } catch (error) {
//     console.error("Error adding teacher:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error while creating teacher",
//       error: error.message
//     });
//   }
// };


import Teacher from "../models/admin/teacher.model.js";

export const addTeacher = async (req, res) => {
  try {
    const teacherData = req.body;

    // Validate incoming object structure
    if (!teacherData) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expected an object"
      });
    }

    if (!teacherData.id) {
      return res.status(400).json({
        success: false,
        message: "Teacher 'id' is required and must be a non-empty string"
      });
    }

    if (!teacherData.name ) {
      return res.status(400).json({
        success: false,
        message: "Teacher 'name' is required and must be a non-empty string"
      });
    }

    // if (
    //   !Array.isArray(teacherData.can_teach) ||
    //   teacherData.can_teach.length === 0 ||
    //   teacherData.can_teach.some((s) => typeof s !== "string" || s.trim() === "")
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Teacher 'can_teach' must be a non-empty array of non-empty strings"
    //   });
    // }

    // Check duplicate
    const existing = await Teacher.findOne({ employeeId: teacherData.id.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Teacher with id '${teacherData.id}' already exists`
      });
    }

    // Map frontend structure → DB schema
    const newTeacher = await Teacher.create({
      employeeId: teacherData.id.trim(),
      name: teacherData.name.trim(),
      subjects: teacherData.can_teach.map((s) => s.trim())
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: newTeacher
    });
  } catch (error) {
    console.error("Error creating teacher:", error);

    // if (error.name === "ValidationError") {
    //   const messages = Object.values(error.errors).map((e) => e.message);
    //   return res.status(400).json({
    //     success: false,
    //     message: messages.join(", ")
    //   });
    // }

    return res.status(500).json({
      success: false,
      message: "Server error: Unable to create teacher"
    });
  }
};
