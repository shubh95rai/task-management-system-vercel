import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import blankProfileImage from "../../assets/images/blank-profile-image1.png";

export default function SideMenu({ activeMenu }) {
  const { user, clearUser } = useContext(UserContext);

  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  function handleCLick(route) {
    if (route === "/logout") {
      handleLogout();
      return;
    }

    navigate(route);
  }

  function handleLogout() {
    localStorage.clear();
    clearUser();
    navigate("/login");
  }

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-60px)] bg-white border-r border-gray-200/50 sticky top-[60px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative size-20 rounded-full overflow-hidden bg-slate-300">
          <img
            src={user?.profileImageUrl || blankProfileImage}
            alt="profile image"
            className="size-full object-cover"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-xs font-medium text-white bg-primary px-3 py-0.5 rounded mt-2">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-sm text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => {
        return (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 py-3 px-6 mb-3 cursor-pointer text-sm sm:text-base ${
              activeMenu == item.label
                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                : ""
            }`}
            onClick={() => handleCLick(item.route)}
          >
            <item.icon className="text-lg sm:text-xl" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
