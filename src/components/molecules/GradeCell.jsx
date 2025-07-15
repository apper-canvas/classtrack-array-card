import React from "react";
import { cn } from "@/utils/cn";

const GradeCell = ({ score, maxPoints, className = "" }) => {
  const percentage = score !== null && score !== undefined ? (score / maxPoints) * 100 : null;
  
  const getGradeClass = (percentage) => {
    if (percentage === null || percentage === undefined) return "";
    if (percentage >= 90) return "grade-cell-a";
    if (percentage >= 80) return "grade-cell-b";
    if (percentage >= 70) return "grade-cell-c";
    if (percentage >= 60) return "grade-cell-d";
    return "grade-cell-f";
  };

  const displayValue = score !== null && score !== undefined ? `${score}/${maxPoints}` : "-";
  const gradeClass = getGradeClass(percentage);

  return (
    <div className={cn(
      "px-3 py-2 text-center text-sm font-medium rounded-md min-w-[70px]",
      gradeClass,
      className
    )}>
      {displayValue}
    </div>
  );
};

export default GradeCell;