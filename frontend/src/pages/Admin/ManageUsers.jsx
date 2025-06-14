import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuFileSpreadsheet } from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import UserCard from "../../components/cards/UserCard";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

export default function ManageUsers() {
  const { loading, setLoading } = useContext(UserContext);

  const [allUsers, setAllUsers] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  async function getAllUsers() {
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      if (response.data.success && response.data.users.length > 0) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching all users:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // downlaod task report
  async function handleDownloadReport() {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_USERS_REPORT,
        {
          responseType: "blob",
        }
      );

      // create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "user-details-report.xlsx");

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error.message);
      toast.error("Failed to download report, please try again.");
    }
  }

  // delete user
  async function deleteUser(userId) {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        API_PATHS.USERS.DELETE_USER(userId)
      );
      if (response.data.success) {
        setOpenDeleteAlert(false);

        // re-fetch the updated list of users
        await getAllUsers();

        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      setOpenDeleteAlert(false);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      {loading ? (
        <Loader />
      ) : (
        <div className="mt-5 mb-10">
          <div className="flex md:items-center md:flex-row justify-between">
            <h2 className="text-xl  font-medium">Team Members</h2>

            <button
              className="flex md:flex download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" /> Download Report
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {allUsers.map((item, index) => (
              <UserCard
                key={item._id}
                userInfo={item}
                openDeleteAlert={openDeleteAlert}
                setOpenDeleteAlert={setOpenDeleteAlert}
                deleteUser={deleteUser}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
