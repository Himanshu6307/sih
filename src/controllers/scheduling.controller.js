// import SchedulingParameters from "../models/admin/scheduling.model.js";

// export const createSchedulingParameters = async (req, res) => {
//   try {
//     const {
//       slots_in_day,
//       slot_duration_minutes,
//       day_start_time,
//       day_end_time,
//       break_times
//     } = req.body;

//     // ✅ Check required fields
//     if (
//       !slots_in_day ||
//       !slot_duration_minutes ||
//       !day_start_time ||
//       !day_end_time
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided"
//       });
//     }

//     // ✅ Check if slots_in_day and slot_duration are positive
//     if (slots_in_day <= 0 || slot_duration_minutes <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Slots in day and slot duration must be greater than 0"
//       });
//     }

//     // ✅ Validate break_times (if provided)
//     if (break_times && Array.isArray(break_times)) {
//       for (let b of break_times) {
//         if (!b.name || !b.start_time || !b.end_time) {
//           return res.status(400).json({
//             success: false,
//             message: "Each break must have name, start_time, and end_time"
//           });
//         }
//       }
//     }

//     // ✅ Save to DB
//     const scheduling = await SchedulingParameters.create({
//       slots_in_day,
//       slot_duration_minutes,
//       day_start_time,
//       day_end_time,
//       break_times
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Scheduling parameters created successfully",
//       data: scheduling
//     });

//   } catch (error) {
//     console.error("Error creating scheduling parameters:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };


 import SchedulingParameters from "../models/admin/scheduling.model.js";

export const createSchedulingParameters = async (req, res) => {
  try {
    const config = req.body;

    // -------- Validation checks --------
    if (!config || typeof config !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expected an object"
      });
    }

    if (
      !config.slots_in_day ||
      typeof config.slots_in_day !== "number" ||
      config.slots_in_day <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "slots_in_day must be a positive number"
      });
    }

    if (
      !config.slot_duration_minutes ||
      typeof config.slot_duration_minutes !== "number" ||
      config.slot_duration_minutes <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "slot_duration_minutes must be a positive number"
      });
    }

    if (!config.day_start_time || typeof config.day_start_time !== "string") {
      return res.status(400).json({
        success: false,
        message: "day_start_time is required and must be a string"
      });
    }

    if (!config.day_end_time || typeof config.day_end_time !== "string") {
      return res.status(400).json({
        success: false,
        message: "day_end_time is required and must be a string"
      });
    }

    if (!Array.isArray(config.break_times)) {
      return res.status(400).json({
        success: false,
        message: "break_times must be an array"
      });
    }

    // Validate each break
    for (let i = 0; i < config.break_times.length; i++) {
      const br = config.break_times[i];
      if (!br.name || !br.start_time || !br.end_time) {
        return res.status(400).json({
          success: false,
          message: `Break time at index ${i} must have name, start_time, and end_time`
        });
      }
    }

    // -------- Save in DB --------
    const newConfig = await  SchedulingParameters.create({
      slots_in_day: config.slots_in_day,
      slot_duration_minutes: config.slot_duration_minutes,
      day_start_time: config.day_start_time.trim(),
      day_end_time: config.day_end_time.trim(),
      break_times: config.break_times.map((b) => ({
        name: b.name.trim(),
        start_time: b.start_time.trim(),
        end_time: b.end_time.trim()
      }))
    });

    return res.status(201).json({
      success: true,
      message: "Timetable configuration created successfully",
      data: newConfig
    });
  } catch (error) {
    console.error("Error creating timetable config:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error: Unable to create timetable configuration"
    });
  }
};
