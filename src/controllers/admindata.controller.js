import Admin from "../models/admin/admin.model.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create/save a new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required."
      });
    }

    //  Check if admin with same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists."
      });
    }

    //  Hash password (directly with 10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create new admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

      // 4. Generate JWT Token
        const token = jwt.sign(
          { id: newAdmin._id, email: newAdmin.email },
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

    //  Fetch admin without password using select
    const adminWithoutPassword = await Admin.findById(newAdmin._id).select("-password");

    res.status(201).json({
      success: true,
      data: adminWithoutPassword
    });


  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create admin."
    });
  }
};
