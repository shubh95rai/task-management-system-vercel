import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/userController.js";

const router = express.Router();

// user managemnet routes
router.get("/", protect, adminOnly, getUsers); // get all users (admin only)
router.get("/:id", protect, getUserById); // get a specific user
router.delete("/:id", protect, adminOnly, deleteUser); // delete a specific user (admin only)

export default router;
