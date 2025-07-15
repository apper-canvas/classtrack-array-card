import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

const Reports = () => {
  const { onMenuClick } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const getPerformanceByGradeLevel = () => {
    const gradeLevels = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"];
const data = gradeLevels.map(level => {
      const studentsInLevel = students.filter(s => s.gradeLevel === level);
      const studentIds = studentsInLevel.map(s => s.Id);
      const levelGrades = grades.filter(g => studentIds.includes(g.studentId));
      
      if (levelGrades.length === 0) return 0;
      
      const averageScore = levelGrades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return sum + (assignment ? (grade.score / assignment.points) * 100 : 0);
      }, 0) / levelGrades.length;
      
      return Math.round(averageScore);
    });

    return {
      series: [{ name: "Average Score", data }],
      categories: gradeLevels
    };
  };

  const getAttendanceByGradeLevel = () => {
    const gradeLevels = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"];
const data = gradeLevels.map(level => {
      const studentsInLevel = students.filter(s => s.gradeLevel === level);
      const studentIds = studentsInLevel.map(s => s.Id);
      const levelAttendance = attendance.filter(a => studentIds.includes(a.studentId));
      
      if (levelAttendance.length === 0) return 0;
      
      const presentCount = levelAttendance.filter(a => a.status === "present").length;
      return Math.round((presentCount / levelAttendance.length) * 100);
    });

    return {
      series: [{ name: "Attendance Rate", data }],
      categories: gradeLevels
    };
  };

  const getTopPerformers = () => {
    const studentPerformance = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.Id);
      if (studentGrades.length === 0) return { ...student, average: 0 };
      
      const averageScore = studentGrades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return sum + (assignment ? (grade.score / assignment.points) * 100 : 0);
      }, 0) / studentGrades.length;
      
      return { ...student, average: Math.round(averageScore) };
    });

    return studentPerformance
      .filter(s => s.average > 0)
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);
  };

  const reportCards = [
    {
      title: "Grade Report",
      description: "Comprehensive grade analysis by student and assignment",
      icon: "FileText",
      action: () => toast.info("Grade report export coming soon")
    },
    {
      title: "Attendance Report",
      description: "Detailed attendance tracking and statistics",
      icon: "Calendar",
      action: () => toast.info("Attendance report export coming soon")
    },
    {
      title: "Student Progress",
      description: "Individual student performance over time",
      icon: "TrendingUp",
      action: () => toast.info("Progress report export coming soon")
    },
    {
      title: "Class Summary",
      description: "Overall class performance and metrics",
      icon: "BarChart",
      action: () => toast.info("Class summary export coming soon")
    }
  ];

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadReportData} />;

  const performanceData = getPerformanceByGradeLevel();
  const attendanceData = getAttendanceByGradeLevel();
  const topPerformers = getTopPerformers();

  return (
    <div className="space-y-6">
      <Header
        title="Reports"
        subtitle="Comprehensive analytics and reports for your classroom"
        onMenuClick={onMenuClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={report.action}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-lg">
                    <ApperIcon name={report.icon} size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <ApperIcon name="Download" size={14} className="mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance by Grade Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={{
                  xaxis: { categories: performanceData.categories },
                  yaxis: { min: 0, max: 100, title: { text: "Average Score %" } },
                  colors: ["#2563eb"],
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      columnWidth: "60%"
                    }
                  },
                  dataLabels: { enabled: true },
                  grid: { borderColor: "#e5e7eb" }
                }}
                series={performanceData.series}
                type="bar"
                height={300}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Grade Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={{
                  xaxis: { categories: attendanceData.categories },
                  yaxis: { min: 0, max: 100, title: { text: "Attendance Rate %" } },
                  colors: ["#10b981"],
                  stroke: { curve: "smooth", width: 3 },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      colorStops: [
                        { offset: 0, color: "#10b981", opacity: 0.4 },
                        { offset: 100, color: "#10b981", opacity: 0.1 }
                      ]
                    }
                  },
                  dataLabels: { enabled: false },
                  grid: { borderColor: "#e5e7eb" }
                }}
                series={attendanceData.series}
                type="area"
                height={300}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={student.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
</div>
                        <div className="text-sm text-gray-500">{student.gradeLevel}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{student.average}%</div>
                    <div className="text-sm text-gray-500">Average</div>
                  </div>
                </div>
              ))}
              {topPerformers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No grade data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;