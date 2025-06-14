export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // register a new user (admin or member)
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile", // get logged-in user details
  },
  USERS: {
    GET_ALL_USERS: "/api/users", // get all users (admin only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // get user by id (admin only)
    CREATE_USER: "/api/users", // create new user (admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // delete user (admin only)
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // get dashboard data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // get user dashboard data
    GET_ALL_TASKS: "/api/tasks", // get all tasks (admin: all tasks, member : assigned tasks)
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // get task by id
    CREATE_TASK: "/api/tasks", // create new task (admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // delete task (admin only)
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // update task status
    UPDATE_TASK_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // update task checklist
  },
  REPORTS: {
    EXPORT_TASKS_REPORT: "/api/reports/export/tasks", // export all tasks report as excel
    EXPORT_USERS_REPORT: "/api/reports/export/users", // export users task report as excel
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // upload image
  },
};
