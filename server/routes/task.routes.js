import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createTaskController, deleteTaskController, getTasksByIdController, getTasksController, updateTaskController } from "../controller/task.controller.js";

const router = express.Router();

router.route('/gp')
    .get(authMiddleware,getTasksController)
    .post(authMiddleware,createTaskController);

router.route('/:id/gp')
    .get(authMiddleware,getTasksByIdController)
    .put(authMiddleware,updateTaskController)
    .delete(authMiddleware,deleteTaskController);

export default router;  




