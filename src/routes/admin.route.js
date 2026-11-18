import express from "express";
import { addTeacher } from "../controllers/teacher.controller.js";
import { getAllTeachers } from "../controllers/getTeachers.controller.js";
import { createAdmin } from "../controllers/admindata.controller.js";
import {loginAdmin } from "../controllers/loginadmin.controller.js";
import { addSubject } from "../controllers/subject.controller.js";
import { getAllSubjects } from "../controllers/getSubject.controller.js";
import { addRoom } from "../controllers/room.controller.js";
import { getAllRooms } from "../controllers/getRoom.controller.js";
import { createSchedulingParameters } from "../controllers/scheduling.controller.js";
import { createBranches } from "../controllers/branch.controller.js";
import { getBranches } from "../controllers/getBranches.controller.js";
import { getLatestSchedulingParameters } from "../controllers/getSchedule.controller.js";
import { getFormattedData } from "../controllers/handle.controller.js";
import { fetchAndSendData } from "../controllers/create.controller.js";    
import { userLogout } from "../controllers/logout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAuth } from "../controllers/isAuth.controller.js";


const router = express.Router();

// 👉 Endpoint: POST /api/admin/teacher
router.post("/addTeacher", addTeacher);
router.get("/teachers", getAllTeachers);
router.post("/createadmin", createAdmin);
router.post("/loginadmin", loginAdmin);
router.post("/addSubject", addSubject);
router.get("/getSubjects", getAllSubjects);
router.post("/addRoom", addRoom);
router.get("/getRooms", getAllRooms);
router.post("/addSchedule", createSchedulingParameters);
router.post("/branches", createBranches);
router.get("/getBranches", getBranches);
router.get("/getSchedule", getLatestSchedulingParameters);  
router.get("/formated", getFormattedData);
router.get("/fetch-send", fetchAndSendData);
router.post("/logout", authMiddleware, userLogout);
router.post("/isAuth", authMiddleware, isAuth);




export default router;
