import User from "../models/user/signup.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup Controller
export const userSignup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // 1. Required fields check
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (fullname, username, email, password) are required",
      });
    }

    // 2. Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "supersecretkey", // use env file in prod
      { expiresIn: "7d" }
    );

    // 6. Set Cookie
    res.cookie("token", token, {
      httpOnly: true, // frontend JS cannot access cookie
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Send success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token, 
      user:newUser,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
};
