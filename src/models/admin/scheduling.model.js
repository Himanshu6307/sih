import mongoose from "mongoose";

const schedulingParametersSchema = new mongoose.Schema({
  slots_in_day: {
    type: Number,
    required: true
  },
  slot_duration_minutes: {
    type: Number,
    required: true
  },
  day_start_time: {
    type: String,
    required: true,
    trim: true
  },
  day_end_time: {
    type: String,
    required: true,
    trim: true
  },
  break_times: {
    type: [
      {
        name: { type: String, required: true, trim: true },
        start_time: { type: String, required: true, trim: true },
        end_time: { type: String, required: true, trim: true }
      }
    ],
    default: []
  },
  days_of_week:{
    type: [],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  
}, { timestamps: true });

const SchedulingParameters = mongoose.model("SchedulingParameters", schedulingParametersSchema);

export default SchedulingParameters;
