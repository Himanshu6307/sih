import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // 1. Token extract karo (cookie se ya header se)
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied.User not authenticated",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );

    // 3. Attach user info to req.user
    req.user = decoded; // { id, email }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};
