import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;