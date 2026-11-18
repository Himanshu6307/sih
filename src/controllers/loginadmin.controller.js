import Admin from "../models/admin/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // ✅ Find admin by email and include password for comparison
    const admin = await Admin.findOne({ email }); // only for login
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found."
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password."
      });
    }

     // 4. Generate JWT Token
        const token = jwt.sign(
          { id: admin._id, email: admin.email },
          process.env.JWT_SECRET || "supersecretkey",
          { expiresIn: "7d" }
        );
    
        // 5. Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });


    res.status(200).json({
      success: true,
      data: admin
    });

  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not login."
    });
  }
};
