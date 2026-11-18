import Branch from "../models/admin/branch.model.js";
export const createBranches = async (req, res) => {
  try {
    let branchesInput = req.body;

    if (!branchesInput || branchesInput.length === 0) {
      return res.status(400).json({ success: false, message: "Request body must contain branch object or an array of branches" });
    }

    // Accept single object or array
    if (!Array.isArray(branchesInput)) branchesInput = [branchesInput];

    // Helpers
    const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
    const toNumber = (v) => {
      if (typeof v === "number" && !Number.isNaN(v)) return v;
      if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(v)) return Number(v);
      return null;
    };

    const errors = [];
    const prepared = [];

    branchesInput.forEach((branch, bIdx) => {
      // branch-level checks
      if (!branch || typeof branch !== "object") {
        errors.push(`branches[${bIdx}] must be an object`);
        return;
      }

      const name = branch.name;
      const code = branch.code;
      if (!isNonEmptyString(name)) errors.push(`branches[${bIdx}].name is required and must be a non-empty string`);
      if (!isNonEmptyString(code)) errors.push(`branches[${bIdx}].code is required and must be a non-empty string`);

      // semesters
      if (!Array.isArray(branch.semesters) || branch.semesters.length === 0) {
        errors.push(`branches[${bIdx}].semesters must be a non-empty array`);
      } else {
        branch.semesters.forEach((sem, sIdx) => {
          if (!sem || typeof sem !== "object") {
            errors.push(`branches[${bIdx}].semesters[${sIdx}] must be an object`);
            return;
          }

          const semNo = toNumber(sem.semester_number);
          if (semNo === null) errors.push(`branches[${bIdx}].semesters[${sIdx}].semester_number is required and must be a number`);

          const studentCount = toNumber(sem.student_count);
          if (studentCount === null) errors.push(`branches[${bIdx}].semesters[${sIdx}].student_count is required and must be a number`);

          // groups
   

          // subjects
          if (!Array.isArray(sem.subjects) || sem.subjects.length === 0) {
            errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects must be a non-empty array`);
          } else {
            sem.subjects.forEach((subj, subIdx) => {
              if (!subj || typeof subj !== "object") {
                errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects[${subIdx}] must be an object`);
                return;
              }

              if (!isNonEmptyString(subj.id)) errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects[${subIdx}].id is required and must be a non-empty string`);
              if (!isNonEmptyString(subj.name)) errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects[${subIdx}].name is required and must be a non-empty string`);

              const cpw = toNumber(subj.classes_per_week);
              if (cpw === null) errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects[${subIdx}].classes_per_week is required and must be a number`);

              // if (!isNonEmptyString(subj.type) || !["Theory", "Lab"].includes(subj.type)) {
              //   errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects[${subIdx}].type is required and must be "Theory" or "Lab"`);
              // }

              // if (subj.type === "Lab") {
              //   const ds = toNumber(subj.duration_slots);
              //   if (ds === null) {
              //     errors.push(`branches[${bIdx}].semesters[${sIdx}].subjects[${subIdx}].duration_slots is required for Lab subjects and must be a number`);
              //   }
              // }
            });
          }
        });
      }

      // if no errors for this branch, prepare a cleaned object for DB
      // (we will push into prepared only if no branch-specific errors found)
    });

    // If any validation errors found, return them all at once
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    // Build cleaned `prepared` array (safe values: trimmed strings + numeric conversion)
    branchesInput.forEach((branch) => {
      const cleanedSemesters = branch.semesters.map((sem) => {
        return {
          semester_number: toNumber(sem.semester_number),
          student_count: toNumber(sem.student_count),
          
          subjects: sem.subjects.map((subj) => {
            const subjectObj = {
              id: String(subj.id).trim(),
              name: String(subj.name).trim(),
              classes_per_week: toNumber(subj.classes_per_week),
              type: String(subj.type).trim()
            };
            if (subjectObj.type === "Lab") {
              subjectObj.duration_slots = toNumber(subj.duration_slots);
            }
            return subjectObj;
          })
        };
      });

      prepared.push({
        name: String(branch.name).trim(),
        code: String(branch.code).trim(),
        semesters: cleanedSemesters
      });
    });

    // Create documents in DB using Branch.create()
    const created = await Branch.create(prepared); // accepts array of docs

    // created can be array (when multiple) or document (when single)
    const createdArray = Array.isArray(created) ? created : [created];

    return res.status(201).json({
      success: true,
      count: createdArray.length,
      data: createdArray
    });
  } catch (error) {
    console.error("createBranches error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    // Duplicate key (if you later add unique indexes)
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate key error", details: error.keyValue });
    }

    return res.status(500).json({ success: false, message: "Server error: Unable to create branches" });
  }
};
