import SchedulingParameters from "../models/admin/scheduling.model.js";

export const getLatestSchedulingParameters = async (req, res) => {
  try {
    const latestConfig = await SchedulingParameters.findOne().sort({ createdAt: -1 });

    if (!latestConfig) {
      return res.status(404).json({
        success: false,
        message: "No scheduling parameters found"
      });
    }

    return res.status(200).json({
      success: true,
      data: latestConfig
    });
  } catch (error) {
    console.error("Error fetching latest scheduling parameters:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: Unable to fetch latest scheduling parameters",
      error: error.message
    });
  }
};
