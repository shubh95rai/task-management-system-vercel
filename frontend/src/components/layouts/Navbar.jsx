import { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Navbar({ activeMenu }) {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="h-15 flex items-center gap-4 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] px-5 sm:px-7 sticky top-0 z-30">
      <button
        className="lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-xl sm:text-2xl" />
        ) : (
          <HiOutlineMenu className="text-xl sm:text-2xl" />
        )}
      </button>

      <h2 className="sm:text-lg font-medium text-black">
        Task Management System
      </h2>

      {openSideMenu && (
        <div className="fixed top-[59px] left-0 bg-white lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
}
