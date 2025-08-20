import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosHome as HomeIcon, IoIosFolderOpen as DriveIcon } from "react-icons/io";
import { MdFolderShared as SharedIcon, MdDelete as TrashIcon } from "react-icons/md";
import { RxExit as LogoutIcon, RxHamburgerMenu as HamburgerIcon } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { CircleLoader } from "react-spinners";
import axios from "axios";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import toast from "react-hot-toast";

const AppLayout = ({ Component, props, onLogout }) => {
    const { user } = useSelector((state) => state.auth);
    const path = useLocation().pathname;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const selected_button = "bg-blue-400 text-white";
    const unselected_button = "bg-white text-gray-700 hover:bg-gray-100";
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            const { data } = await axios.post(`${server}/api/auth/logout`, {
                withCredentials: true
            })
            dispatch(userNotExists())
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const NavLinks = () => (
        <nav className="flex flex-col gap-2 text-gray-700">
            <Link
                className={`${path.includes("home") ? selected_button : unselected_button} p-2 rounded text-left flex items-center gap-4 text-xl`}
                to={"/home"}
            >
                <HomeIcon /> Home
            </Link>
            <Link
                className={`${path.includes("my-drive") ? selected_button : unselected_button} p-2 rounded text-left flex items-center gap-4 text-xl`}
                to={"/my-drive"}
            >
                <DriveIcon /> My Drive
            </Link>
            <Link
                className={`${path.includes("shared") ? selected_button : unselected_button} p-2 rounded text-left flex items-center gap-4 text-xl`}
                to={"/shared"}
            >
                <SharedIcon /> Shared
            </Link>
            <Link
                className={`${path.includes("trash") ? selected_button : unselected_button} p-2 rounded text-left flex items-center gap-4 text-xl`}
                to={"/trash"}
            >
                <TrashIcon /> Trash
            </Link>
        </nav>
    );

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100">
            {/* Topbar */}
            <div className="h-14 bg-white shadow flex items-center justify-between px-6">
                {/* Hamburger on mobile */}
                <HamburgerIcon
                    size={"1.6rem"}
                    className="cursor-pointer md:hidden"
                    onClick={() => setIsDrawerOpen(true)}
                />

                <div className="sm:text-xl font-bold text-gray-700  flex flex-row gap-1 sm:gap-4">
                    Infinite Void <CircleLoader size={"sm:2rem"} />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-gray-700">
                            {user?.name || "User"}
                        </span>
                    </div>
                    <LogoutIcon
                        size={"1.8rem"}
                        className="cursor-pointer"
                        onClick={logoutHandler}
                    />
                </div>
            </div>

            {/* ===== Main Body ===== */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (desktop) */}
                <aside className="w-60 bg-white shadow-md p-4 md:flex flex-col gap-4 hidden">
                    <NavLinks />
                </aside>

                {/* Drawer (mobile) */}
                {isDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsDrawerOpen(false)}
                        ></div>

                        {/* Drawer */}
                        <aside className="fixed top-0 left-0 h-full w-60 bg-white shadow-lg p-4 z-50 flex flex-col gap-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Menu</span>
                                <button
                                    className="text-gray-600 font-bold"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <NavLinks />
                        </aside>
                    </>
                )}

                {/* Content */}
                <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                    <Component {...props} />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
