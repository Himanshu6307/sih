import Room from "../models/admin/room.model.js";

// Get All Rooms Controller
export const getAllRooms = async (req, res) => {
  try {
    // Query all rooms from database
    const rooms = await Room.find();

    // Agar koi room na mile
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching rooms",
      error: error.message,
    });
  }
};
