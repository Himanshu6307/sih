// src/models/admin.model.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,   // duplicate emails allow na ho
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6    // minimum 6 characters
    }
  },
  { timestamps: true } // createdAt, updatedAt automatically add ho jaayega
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
