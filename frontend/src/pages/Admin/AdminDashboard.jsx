import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect } from "react";
import momemt from "moment";
import { addThousandsSeparator } from "../../utils/helper.js";
import InfoCard from "../../components/cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable.jsx";
import CustomPieChart from "../../components/charts/CustomPieChart.jsx";
import CustomBarChart from "../../components/charts/CustomBarChart.jsx";
import Loader from "../../components/Loader.jsx";

const COLORS = ["#8d51ff", "#00b8db", "#7bce00"];

export default function AdminDashboard() {
  const { user, loading, setLoading } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // prepare chart data
  function prepareChartData(data) {
    const taskDistribution = data.taskDistribution || null;
    const taskPriorityLevels = data.taskPriorityLevels || null;

    const taskDistributionData = [
      {
        status: "Pending",
        count: taskDistribution?.Pending || 0,
      },
      {
        status: "In Progress",
        count: taskDistribution?.InProgress || 0,
      },
      {
        status: "Completed",
        count: taskDistribution?.Completed || 0,
      },
    ];

    setPieChartData(taskDistributionData);

    const taskPriorityLevelsData = [
      {
        priority: "Low",
        count: taskPriorityLevels?.Low || 0,
      },
      {
        priority: "Medium",
        count: taskPriorityLevels?.Medium || 0,
      },
      {
        priority: "High",
        count: taskPriorityLevels?.High || 0,
      },
    ];

    setBarChartData(taskPriorityLevelsData);
  }
  // dashboard data
  async function getDashboardData() {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );

      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
        prepareChartData(response.data.dashboardData?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error.message);
    } finally {
      setLoading(false);
    }
  }

  function onSeeMore() {
    navigate("/admin/tasks");
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  // console.log(dashboardData, barChartData, pieChartData);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="card my-5">
            <div>
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl">
                  Good Morning! {user?.name}
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1.5">
                  {momemt(Date.now()).format("DD MMM YYYY")}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="Total Tasks"
                value={
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.All
                  ) || 0
                }
                color="bg-primary"
              />

              <InfoCard
                label="Pending Tasks"
                value={
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.Pending
                  ) || 0
                }
                color="bg-violet-500"
              />

              <InfoCard
                label="In Progress Tasks"
                value={
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.InProgress
                  ) || 0
                }
                color="bg-cyan-500"
              />

              <InfoCard
                label="Completed Tasks"
                value={
                  addThousandsSeparator(
                    dashboardData?.charts?.taskDistribution?.Completed
                  ) || 0
                }
                color="bg-lime-500"
              />
            </div>
          </div>

          {dashboardData?.statistics?.totalTasks > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 my-4 md:my-6">
              <div>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Task Distribution</h5>
                  </div>

                  <CustomPieChart data={pieChartData} color={COLORS} />
                </div>
              </div>

              <div>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Task Priority Levels</h5>
                  </div>

                  <CustomBarChart data={barChartData} />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg">Recent Tasks</h5>
                    <button className="card-btn" onClick={onSeeMore}>
                      See All <LuArrowRight className="text-sm" />
                    </button>
                  </div>

                  <TaskListTable tableData={dashboardData?.recentTasks || []} />
                </div>
              </div>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center">
              <h2 className="text-xl">No tasks found</h2>
              <p className="text-sm text-gray-500">
                You haven't created any tasks yet. Create one now!
              </p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
