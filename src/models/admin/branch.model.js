import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Branch name is required"], trim: true },
  code: { type: String, required: [true, "Branch code is required"], trim: true },

  semesters: [
    {
      semester_number: { type: Number, required: [true, "Semester number is required"] },
      student_count: { type: Number, required: [true, "Student count is required"] },


      subjects: {
        type: [
          {
            id: { type: String, required: [true, "Subject id is required"], trim: true },
            name: { type: String, required: [true, "Subject name is required"], trim: true },
            classes_per_week: { type: Number, required: [true, "classes_per_week is required"] },
            type: { type: String, enum: ["Theory", "Lab"], required: [true, "Subject type is required"] },
            duration_slots: {
              type: Number,
              required: function () { return this.type === "Lab"; } // required for labs
            }
          }
        ],
        required: [true, "At least one subject is required"],
        validate: {
          validator: (arr) => Array.isArray(arr) && arr.length > 0,
          message: "subjects must be a non-empty array"
        }
      }
    }
  ]
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
