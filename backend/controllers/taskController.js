import Task from "../models/Task.js";

// get dashbaord data
// GET /api/tasks/dashboard-data
// protected route (JWT required, admin only)
async function getDashboardData(req, res) {
  try {
    // fetch statictics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overDueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // all statuses count object
    const taskStatuses = ["Pending", "In Progress", "Completed"];

    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // remove spaces from status

      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;

      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    // all priorities count object
    const taskPriorities = ["Low", "Medium", "High"];

    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;

      return acc;
    }, {});

    // fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      success: true,
      dashboardData: {
        statistics: {
          totalTasks,
          pendingTasks,
          completedTasks,
          overDueTasks,
        },
        charts: {
          taskDistribution,
          taskPriorityLevels,
        },
        recentTasks,
      },
      message: "Dashboard data fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// get user dashboard data (user specific)
// GET /api/tasks/user-dashboard-data
// protected route (JWT required)
async function getUserDashboardData(req, res) {
  try {
    const userId = req.user._id; // user id of logged in user

    // fetch statictics
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overDueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // all statuses count object
    const taskStatuses = ["Pending", "In Progress", "Completed"];

    const taskDistributionRaw = await Task.aggregate([
      {
        $match: { assignedTo: userId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // remove spaces from status

      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;

      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    // all priorities count object
    const taskPriorities = ["Low", "Medium", "High"];

    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $match: { assignedTo: userId },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;

      return acc;
    }, {});

    // fetch recent 10 tasks
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      success: true,
      userDashboardData: {
        statistics: {
          totalTasks,
          pendingTasks,
          completedTasks,
          overDueTasks,
        },
        charts: {
          taskDistribution,
          taskPriorityLevels,
        },
        recentTasks,
      },
      message: "User dashboard data fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// get all tasks (admin: all tasks, member : assigned tasks)
// GET /api/tasks/
// protected route (JWT required)
async function getTasks(req, res) {
  try {
    const { status } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    // add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map((task) => {
        const completedCount = task.todoChecklist.filter((todo) => {
          return todo.completed === true;
        }).length;

        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status summary counts
    const totalTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role === "admin" ? {} : { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role === "admin" ? {} : { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role === "admin" ? {} : { assignedTo: req.user._id }),
    });

    res.status(200).json({
      success: true,
      tasks,
      statusSummary: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// get task by id
// GET /api/tasks/:id
// protected route (JWT required)
async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
      message: "Task fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// create a new task
// POST /api/tasks/
// protected route (JWT required, admin only)
async function createTask(req, res) {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required",
      });
    }

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "assignedTo must be an array of user IDs",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklist,
    });

    res.status(201).json({
      success: true,
      task,
      message: "Task created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// update task details
// PUT /api/tasks/:id
// protected route (JWT required)
async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.attachments = req.body.attachments || task.attachments;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "assignedTo must be an array of user IDs",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      task: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// delete task
// DELETE /api/tasks/:id
// protected route (JWT required, admin only)
async function deleteTask(req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// update task status
// PUT /api/tasks/:id/status
// protected route (JWT required)
async function updateTaskStatus(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const isAssigned = task.assignedTo.includes(req.user._id);

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update task status",
      });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((todo) => {
        todo.completed = true;
      });
      task.progress = 100;
    }

    await task.save();

    res.status(200).json({
      success: true,
      task,
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// update task checklist
// PUT /api/tasks/:id/todo
// protected route (JWT required)
async function updateTaskChecklist(req, res) {
  try {
    const { todoChecklist } = req.body;

    if (!todoChecklist) {
      return res.status(400).json({
        success: false,
        message: "Todo checklist is required",
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const isAssigned = task.assignedTo.includes(req.user._id);

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update task checklist",
      });
    }

    task.todoChecklist = todoChecklist; // update todoChecklist

    // auto-update task status based on todoChecklist
    const completedCount = task.todoChecklist.filter(
      (todo) => todo.completed === true
    ).length;

    const totalItems = task.todoChecklist.length;

    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // auto-mark task as completed if all items are completed
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.status(200).json({
      success: true,
      task: updatedTask,
      message: "Task checklist updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  updateTaskChecklist,
  deleteTask,
};
