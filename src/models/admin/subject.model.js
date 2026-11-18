// models/subject.model.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
    },
    type: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      required: true,
      min: 0,
      // adjust based on your system
    },
 
   
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
