// controllers/data.controller.js
import Room from "../models/admin/room.model.js";
import Teacher from "../models/admin/teacher.model.js";
import Branch from "../models/admin/branch.model.js";
import ScheduleParam from "../models/admin/scheduling.model.js";

export const getFormattedData = async (req, res) => {
  try {
    // 1. Rooms
    const roomRes = await Room.find({});
    const classrooms = roomRes.map(r => ({
      name: r.name,
      capacity: r.capacity,
      type: r.type
    }));

    // 2. Teachers
    const teacherRes = await Teacher.find({});
    const faculties = teacherRes.map(t => ({
      id: t.employeeId || t._id.toString().slice(0, 3).toUpperCase(),
      name: t.name,
      can_teach: t.subjects || []
    }));

    // 3. Branches
    const branchRes = await Branch.find({});
    const branches = branchRes.map(b => ({
      name: b.name,
      code: b.code,
      semesters: b.semesters.map(s => ({
        semester_number: s.semester_number,
        student_count: s.student_count,
        subjects: s.subjects.map(sub => ({
          id: sub.id,
          name: sub.name,
          classes_per_week: sub.classes_per_week,
          type: sub.type,
          duration_slots: sub.duration_slots || (sub.type === "Lab" ? 2 : 1) // defaulting
        }))
      }))
    }));

    // 4. Scheduling Parameters
    const scheduleRes = await ScheduleParam.findOne({});
    const scheduling_parameters = {
      slots_in_day: scheduleRes?.slots_in_day || 8,
      slot_duration_minutes: scheduleRes?.slot_duration_minutes || 60,
      day_start_time: scheduleRes?.day_start_time || "09:00",
      day_end_time: scheduleRes?.day_end_time || "17:00",
      break_times:[],
      days_of_week: scheduleRes?.days_of_week || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    };

    // ✅ Final Combined Format
    const formattedData = {
      classrooms,
      faculties,
      branches,
      scheduling_parameters,
        general_constraints: []
    };

    res.status(200).json(formattedData);

  } catch (error) {
    console.error("Error formatting data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to format data",
      error: error.message
    });
  }
};
