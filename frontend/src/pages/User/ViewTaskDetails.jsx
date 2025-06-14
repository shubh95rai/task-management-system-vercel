import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";
import { CgSpinner } from "react-icons/cg";

export default function ViewTaskDetails() {
  const { loading, setLoading } = useContext(UserContext);
  const [updatingChecklistId, setUpdatingChecklistId] = useState(null);

  const { id } = useParams();

  const [task, setTask] = useState(null);

  function getStatusTagColor(status) {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  }

  // get task info by ID
  async function getTaskInfoByID() {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data.success) {
        const taskInfo = response.data.task;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching task details:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // update todo checklist
  async function updateTodoChecklist(index, todoId) {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
    }

    setUpdatingChecklistId(todoId);
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(taskId),
        {
          todoChecklist,
        }
      );

      if (response.data.success) {
        setTask(response.data.task || task);
      } else {
        // optionally revert the toggle if the api call fails
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    } catch (error) {
      console.error("Error updating todo checklist:", error.message);

      todoChecklist[index].completed = !todoChecklist[index].completed;

      toast.error(error.response.data.message);
    } finally {
      setUpdatingChecklistId(null);
    }
  }

  //handle attachment link
  function handleLinkClick(link) {
    if (!link.startsWith("https")) {
      link = `https://${link}`; // default to https
    }

    window.open(link, "_blank");
  }

  useEffect(() => {
    if (id) {
      getTaskInfoByID();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      {loading ? (
        <Loader />
      ) : (
        <div className="mt-5">
          {task && (
            <div className="grid md:grid-cols-4 mt-4">
              <div className="form-card col-span-3">
                {/* title, status */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm md:text-xl font-medium">
                    {task?.title}
                  </h2>

                  <div
                    className={`text-xs md:text-sm font-medium px-4 py-0.5 rounded ${getStatusTagColor(
                      task?.status
                    )}`}
                  >
                    {task?.status}
                  </div>
                </div>

                {/* description */}
                <div className="mt-4">
                  <InfoBox label="Description" value={task?.description} />
                </div>

                {/* priority, due date, assigned to */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-6 md:col-span-4">
                    <InfoBox label="Priority" value={task?.priority} />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <InfoBox
                      label="Due Date"
                      value={
                        task?.dueDate
                          ? moment(task?.dueDate).format("DD MMM YYYY")
                          : "No due date"
                      }
                    />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-500">
                      Assigned To
                    </label>

                    <AvatarGroup
                      avatars={
                        task?.assignedTo.map((item) => item?.profileImageUrl) ||
                        []
                      }
                      maxVisible={5}
                    />
                  </div>
                </div>

                {/* todo checklist */}
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Todo Checklist
                  </label>

                  {task?.todoChecklist.map((item, index) => (
                    <TodoChecklist
                      key={`todo ${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index, item._id)}
                      updatingChecklistId={updatingChecklistId}
                      todoUpdateLoading={updatingChecklistId === item._id}
                    />
                  ))}
                </div>

                {/* attachments */}
                {task?.attachments.length > 0 && (
                  <div className="mt-2">
                    <label className="text-xs font-medium text-slate-500">
                      Attachments
                    </label>

                    {task?.attachments.map((link, index) => (
                      <Attachments
                        key={`link ${index}`}
                        link={link}
                        index={index}
                        onClick={() => handleLinkClick(link)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

function InfoBox({ label, value }) {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="text-xs md:text-sm font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
}

function TodoChecklist({
  text,
  isChecked,
  onChange,
  todoUpdateLoading,
  updatingChecklistId,
}) {
  return (
    <div
      className="flex items-center gap-3 p-3
    "
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="size-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
        disabled={!!updatingChecklistId}
      />
      <p className="text-sm text-gray-800">{text}</p>

      {/* loader */}
      {todoUpdateLoading && (
        <CgSpinner className="animate-spin text-primary" size={20} />
      )}
    </div>
  );
}

function Attachments({ link, index, onClick }) {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 ">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs text-black">{link}</p>
      </div>
      <LuSquareArrowOutUpRight className="text-gray-400" />
    </div>
  );
}
