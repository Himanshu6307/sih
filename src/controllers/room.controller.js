// controllers/room.controller.js
import Room from "../models/admin/room.model.js";

// Add Room Controller
export const addRoom = async (req, res) => {
  try {
    const roomData = req.body;
    const { name, capacity, type } = roomData;

    // 1. Check required fields
    if (!name || !capacity || !type) {
      return res.status(400).json({
        success: false,
        message: "Name, Capacity and Type are required fields",
      });
    }

    // 2. Validate capacity
    if (capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be greater than 0",
      });
    }

    // 3. Validate type
    // const allowedTypes = ["theory", "lab", "lecture"];
    // if (!allowedTypes.includes(type)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Invalid room type. Allowed types: ${allowedTypes.join(", ")}`,
    //   });
    // }

    // 4. Check duplicate room
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room with this name already exists",
      });
    }

    // 5. Create and Save room
    const room = await Room.create({
      name,
      capacity,
      type,
    });

    // 6. Success response
    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
