// models/room.model.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      unique: true,
      trim: true, // Example: "CSE Classroom 101"
    },
    capacity: {
      type: Number,
      required: [true, "Room capacity is required"],
   
    },
    type: {
      type: String,
      required: true,
      default: "theory",
    }
    
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
