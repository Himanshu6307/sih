import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  // Teacher ka naam
  name: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Kaun-kaun se subjects padhata hai (ek teacher multiple subjects le sakta hai)
  subjects: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],

}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
