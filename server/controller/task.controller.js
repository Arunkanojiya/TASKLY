    import { Task } from "../model/task.model.js";
    import { User } from "../model/user.model.js";



    export const createTaskController = async (req, res) => {
        try {
            const { title, description, priority, dueDate, completed } = req.body;

            const task = new Task({
                title,
                description,
                priority,
                dueDate,
                completed: completed === "Yes" || completed === true,
                owner: req.user.id
            })
            const saved = await task.save();
            res.status(201).json({ success: true, message: "Task created successfully", task: saved });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    export const getTasksController = async (req, res) => {
        try {
            const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
            res.status(200).json({ success: true, tasks});

        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // get single task
    export const getTasksByIdController = async (req, res) => {
        try {
            const task = await Task.findOne({
                _id:req.params.id,
                owner: req.user.id 
            })
            if (!task) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }
            res.status(200).json({ success: true, task });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    //update A task
    export const updateTaskController = async (req, res) => {
        try {
            const data = { ...req.body };
            if (data.completed !== undefined) {
                data.completed = data.completed === "Yes" || data.completed === true;
            }
            const updated = await Task.findOneAndUpdate({
                _id: req.params.id,
                owner: req.user.id
            },data,
            { new: true, runValidators: true }
            )
            if (!updated) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }
            res.status(200).json({ success: true, message: "Task updated successfully", task: updated });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    //delete a task
    export const deleteTaskController = async (req, res) => {
        try {
            const deleted = await Task.findOneAndDelete({
                _id: req.params.id,
                owner: req.user.id
            })
            if (!deleted) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }
            res.status(200).json({ success: true, message: "Task deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }