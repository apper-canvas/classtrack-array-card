import React from "react";
import { motion } from "framer-motion";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/students", icon: "Users", label: "Students" },
    { to: "/grades", icon: "BookOpen", label: "Grades" },
    { to: "/attendance", icon: "Calendar", label: "Attendance" },
    { to: "/reports", icon: "BarChart3", label: "Reports" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-lg">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <ApperIcon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">ClassTrack</h1>
                <p className="text-sm text-gray-500">Student Management</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-6 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative flex flex-col w-64 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between flex-shrink-0 px-6 py-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                  <ApperIcon name="GraduationCap" size={24} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">ClassTrack</h1>
                  <p className="text-sm text-gray-500">Student Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 pb-6 space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClick={onClose}
                />
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;