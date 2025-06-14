import express from "express";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// task routes
router.get("/dashboard-data", protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // get all tasks
router.get("/:id", protect, getTaskById); // get a specific task
router.post("/", protect, adminOnly, createTask); // create a new task (admin only)
router.put("/:id", protect, updateTask); // update task details
router.delete("/:id", protect, adminOnly, deleteTask); // delete task (admin only)
router.put("/:id/status", protect, updateTaskStatus); // update task status
router.put("/:id/todo", protect, updateTaskChecklist); // update task checklist

export default router;
