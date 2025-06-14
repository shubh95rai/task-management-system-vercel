import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  exportTasksReport,
  exportUsersReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport); // export all tasks report as excel
router.get("/export/users", protect, adminOnly, exportUsersReport); // export users task report as excel

export default router;
