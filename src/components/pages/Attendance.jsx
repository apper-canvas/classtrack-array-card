import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const Attendance = () => {
  const { onMenuClick } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "Active"));
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const headerActions = [
    {
      label: "Take Attendance",
      icon: "CheckCircle",
      onClick: () => toast.info("Take Attendance functionality coming soon"),
      variant: "primary"
    },
    {
      label: "Export Report",
      icon: "Download",
      onClick: () => toast.info("Export functionality coming soon"),
      variant: "outline"
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadAttendanceData} />;

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <Header
          title="Attendance"
          subtitle="Track daily student attendance"
          onMenuClick={onMenuClick}
          actions={headerActions}
        />
        <Empty
          title="No active students"
          description="Add students to your roster before tracking attendance."
          actionText="Go to Students"
          onAction={() => window.location.href = "/students"}
          icon="Calendar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Attendance"
        subtitle={`Track attendance for ${students.length} active students`}
        onMenuClick={onMenuClick}
        actions={headerActions}
      />

      <AttendanceGrid
        students={students}
        attendance={attendance}
        startDate={selectedDate}
      />
    </div>
  );
};

export default Attendance;