export const userLogout = async (req, res) => {
  try {
    // Clear the cookie by setting it to empty + expired
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
};
