import express from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  getAllTasks,
  blockUserController,
  unblockUserController,
  addUserController,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
} from "../controller/admin.controller.js";

const router = express.Router();

// Admin profile routes
router.get("/me", authMiddleware, isAdmin, getAdminProfile);
router.put("/me", authMiddleware, isAdmin, updateAdminProfile);

// User management
router.post("/users", authMiddleware, isAdmin, addUserController);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);


// admin.routes.js
router.put('/password', authMiddleware, isAdmin, changeAdminPassword);

router.put("/user/block/:id", authMiddleware, isAdmin, blockUserController);
router.put("/user/unblock/:id", authMiddleware, isAdmin, unblockUserController);

// Tasks
router.get("/tasks", authMiddleware, isAdmin, getAllTasks);

export default router;
