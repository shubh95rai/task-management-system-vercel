import {
  LuLayoutDashboard,
  LuClipboardCheck,
  LuSquarePlus,
  LuUsers,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "1",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    route: "/admin/dashboard",
  },
  {
    id: "2",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    route: "/admin/tasks",
  },
  {
    id: "3",
    label: "Create Task",
    icon: LuSquarePlus,
    route: "/admin/create-task",
  },
  {
    id: "4",
    label: "Team Members",
    icon: LuUsers,
    route: "/admin/users",
  },
  {
    id: "5",
    label: "Logout",
    icon: LuLogOut,
    route: "/logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "1",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    route: "/user/dashboard",
  },
  {
    id: "2",
    label: "My Tasks",
    icon: LuClipboardCheck,
    route: "/user/my-tasks",
  },
  {
    id: "3",
    label: "Logout",
    icon: LuLogOut,
    route: "/logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

export const ROLE_DATA = [
  { label: "Admin", value: "Admin" },
  { label: "Member", value: "Member" },
];
