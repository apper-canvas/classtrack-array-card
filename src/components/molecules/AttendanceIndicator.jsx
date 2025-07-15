import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AttendanceIndicator = ({ status, className = "" }) => {
  const indicators = {
    present: {
      icon: "Check",
      color: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      label: "Present"
    },
    absent: {
      icon: "X",
      color: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
      label: "Absent"
    },
    late: {
      icon: "Clock",
      color: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      label: "Late"
    },
    excused: {
      icon: "Calendar",
      color: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      label: "Excused"
    }
  };

  const indicator = indicators[status] || indicators.absent;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-medium",
        indicator.color,
        className
      )}
      title={indicator.label}
    >
      <ApperIcon name={indicator.icon} size={14} />
    </div>
  );
};

export default AttendanceIndicator;