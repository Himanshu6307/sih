import Branch from "../models/admin/branch.model.js";

// GET all branches (with semesters & subjects)
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No branches found",
      });
    }

    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    console.error("getBranches error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to fetch branches",
      error: error.message,
    });
  }
};
