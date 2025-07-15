import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const NavigationItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <motion.div 
          className="flex items-center w-full"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon 
            name={icon} 
            size={18} 
            className={isActive ? "text-white" : "text-gray-500"} 
          />
          <span className="ml-3">{label}</span>
        </motion.div>
      )}
    </NavLink>
  );
};

export default NavigationItem;