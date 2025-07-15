import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import AttendanceIndicator from "@/components/molecules/AttendanceIndicator";
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";

const AttendanceGrid = ({ students, attendance, startDate = new Date() }) => {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAttendanceForStudentAndDate = (studentId, date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const record = attendance.find(a => 
      a.studentId === studentId && 
      format(new Date(a.date), "yyyy-MM-dd") === dateString
    );
    return record?.status || "absent";
  };

  const calculateAttendanceRate = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const presentCount = studentAttendance.filter(a => a.status === "present").length;
    const totalCount = studentAttendance.length;
    return totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 min-w-[200px]">
                  Student
                </th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    <div>
                      <div className="font-semibold">{format(day, "EEE")}</div>
                      <div className="text-xs text-gray-400">{format(day, "MM/dd")}</div>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <motion.tr
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 transition-all duration-200"
                >
                  <td className="px-4 py-4 whitespace-nowrap sticky left-0 bg-white border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  {weekDays.map((day) => (
                    <td key={day.toISOString()} className="px-3 py-4 text-center">
                      <div className="flex justify-center">
                        <AttendanceIndicator
                          status={getAttendanceForStudentAndDate(student.Id, day)}
                        />
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <div className="font-semibold text-gray-900">
                      {calculateAttendanceRate(student.Id)}%
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceGrid;