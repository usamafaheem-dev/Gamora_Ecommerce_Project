import React, { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <>
            <div className="flex">
                <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
                <div className=" flex-1 w-full overflow-hidden">
                    <Header toggleSidebar={toggleSidebar} />
                    <div className="main-container p-10 xs:p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;

