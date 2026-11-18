export const isAuth = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User authenticated",
    });
  } catch (error) {
    console.error("isAuth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking authentication",
      error: error.message,
    });
  }
};
