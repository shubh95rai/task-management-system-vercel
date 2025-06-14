import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import { PRIORITY_DATA } from "../../utils/data";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

export default function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  function handleValueChange(key, value) {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }

  function clearData() {
    // reset form data
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  }

  // create task
  async function createTask() {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        clearData();
      }
    } catch (error) {
      console.error("Error creating task:", error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  // update task
  async function updateTask() {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];

        const matchedTask = prevTodoChecklist.find(
          (todo) => todo.text === item
        );

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todoList,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  // get task details by ID
  async function getTaskDetailsByID() {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data.success) {
        const taskInfo = response.data.task;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task details:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // delete task
  async function deleteTask() {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        API_PATHS.TASKS.DELETE_TASK(taskId)
      );
      if (response.data.success) {
        setOpenDeleteAlert(false);
        toast.success(response.data.message);
        navigate("/admin/tasks");
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  // submit task
  async function handleSubmit() {
    setError(null);

    // input validation
    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due Date is required");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task is not assigned to any member");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  }

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      {loading ? (
        <Loader />
      ) : (
        <div className="my-5">
          <div className="grid md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              {/* header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">
                  {taskId ? "Edit Task" : "Create Task"}
                </h2>

                {taskId && (
                  <button
                    className="flex items-center gap-1.5 text-sm font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                    onClick={() => {
                      setOpenDeleteAlert(true);
                    }}
                  >
                    <LuTrash2 className="text-base" />
                    Delete Task
                  </button>
                )}
              </div>

              {/* task title */}
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600">
                  Task Title
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Create App UI"
                  value={taskData.title}
                  onChange={(e) => {
                    handleValueChange("title", e.target.value);
                  }}
                />
              </div>

              {/* description */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Description
                </label>

                <textarea
                  placeholder="Describe text"
                  className="form-input"
                  rows={4}
                  value={taskData.description}
                  onChange={(e) => {
                    handleValueChange("description", e.target.value);
                  }}
                />
              </div>

              {/* priority - due date - assigned to */}
              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    {" "}
                    Priority
                  </label>

                  <SelectDropdown
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) => {
                      handleValueChange("priority", value);
                    }}
                    placeholder="Select Priority"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Due Date
                  </label>

                  <input
                    type="date"
                    placeholder="Create App UI"
                    className="form-input"
                    value={taskData.dueDate || ""}
                    onChange={(e) =>
                      handleValueChange("dueDate", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <label className="text-xs font-medium text-slate-600">
                    Assigned To
                  </label>

                  <SelectUsers
                    selectedUsers={taskData.assignedTo}
                    setSelectedUsers={(value) => {
                      handleValueChange("assignedTo", value);
                    }}
                  />
                </div>
              </div>

              {/* todo list */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Todo Checklist
                </label>

                <TodoListInput
                  todoList={taskData?.todoChecklist}
                  setTodoList={(value) =>
                    handleValueChange("todoChecklist", value)
                  }
                />
              </div>

              {/* attachments */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Attachments
                </label>

                <AddAttachmentsInput
                  attachments={taskData?.attachments}
                  setAttachments={(value) =>
                    handleValueChange("attachments", value)
                  }
                />
              </div>

              {error && (
                <p className="text-red-500 font-medium mt-5 text-xs">{error}</p>
              )}

              {/* submit button */}
              <div className="flex justify-end mt-5">
                <button
                  className="add-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {taskId ? "UPDATE TASK" : "CREATE TASK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
}
