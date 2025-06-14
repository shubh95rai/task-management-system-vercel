import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";
import Loader from "../../components/Loader";
import { UserContext } from "../../context/userContext";

export default function MyTasks() {
  const { loading, setLoading } = useContext(UserContext);

  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  async function getAllTasks() {
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      if (response.data.success) {
        setAllTasks(response.data.tasks || []);

        // map status summary data with fixed labels and order
        const statusSummary = response.data.statusSummary || {};

        const statusArray = [
          { label: "All", count: statusSummary.totalTasks || 0 },
          { label: "Pending", count: statusSummary.pendingTasks || 0 },
          { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
          { label: "Completed", count: statusSummary.completedTasks || 0 },
        ];

        setTabs(statusArray);
      }
    } catch (error) {
      console.error("Error fetching all tasks:", error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClick(taskData) {
    navigate(`/user/task-details/${taskData._id}`);
  }

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      {loading ? (
        <Loader />
      ) : allTasks.length > 0 ? (
        <div className="my-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h2 className="text-xl font-medium">My Tasks</h2>

            {tabs?.[0]?.count > 0 && (
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {allTasks.map((item, index) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo.map((item) => item.profileImageUrl)}
                attachmentCount={item.attachments.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center mt-5">
          <h2 className="text-xl">No tasks found</h2>
          <p className="text-sm text-gray-500">
            You haven't been assigned any tasks yet.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
