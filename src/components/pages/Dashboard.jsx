import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatsCard from "@/components/molecules/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const { onMenuClick } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
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
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const activeStudents = students.filter(s => s.status === "Active").length;
    
    const totalGrades = grades.length;
    const averageScore = totalGrades > 0 ? 
      grades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return sum + (assignment ? (grade.score / assignment.points) * 100 : 0);
      }, 0) / totalGrades : 0;

    const presentCount = attendance.filter(a => a.status === "present").length;
    const attendanceRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

    return {
      activeStudents,
      averageScore: Math.round(averageScore),
      attendanceRate: Math.round(attendanceRate),
      totalAssignments: assignments.length
    };
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    grades.forEach(grade => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      if (assignment) {
        const percentage = (grade.score / assignment.points) * 100;
        if (percentage >= 90) distribution.A++;
        else if (percentage >= 80) distribution.B++;
        else if (percentage >= 70) distribution.C++;
        else if (percentage >= 60) distribution.D++;
        else distribution.F++;
      }
    });

    return {
      series: Object.values(distribution),
      labels: Object.keys(distribution)
    };
  };

  const getAttendanceTrend = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const trendData = last7Days.map(date => {
      const dayAttendance = attendance.filter(a => 
        a.date.split("T")[0] === date
      );
      const presentCount = dayAttendance.filter(a => a.status === "present").length;
      const totalCount = dayAttendance.length;
      return totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
    });

    return {
      series: [{ name: "Attendance Rate", data: trendData }],
      categories: last7Days.map(date => new Date(date).toLocaleDateString("en-US", { weekday: "short" }))
    };
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = calculateStats();
  const gradeDistribution = getGradeDistribution();
  const attendanceTrend = getAttendanceTrend();

  return (
    <div className="space-y-6">
      <Header
        title="Dashboard"
        subtitle="Welcome to ClassTrack - Your complete student management solution"
        onMenuClick={onMenuClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Students"
          value={stats.activeStudents}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+2 this week"
        />
        <StatsCard
          title="Class Average"
          value={`${stats.averageScore}%`}
          icon="BookOpen"
          color="secondary"
          trend="up"
          trendValue="+3% this month"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="success"
          trend="up"
          trendValue="+1% this week"
        />
        <StatsCard
          title="Assignments"
          value={stats.totalAssignments}
          icon="FileText"
          color="warning"
          trend="up"
          trendValue="+1 this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={{
                  labels: gradeDistribution.labels,
                  colors: ["#10b981", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"],
                  legend: { position: "bottom" },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "65%"
                      }
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: function(val, opts) {
                      return opts.w.config.series[opts.seriesIndex];
                    }
                  }
                }}
                series={gradeDistribution.series}
                type="donut"
                height={300}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={{
                  xaxis: {
                    categories: attendanceTrend.categories
                  },
                  yaxis: {
                    min: 0,
                    max: 100,
                    title: { text: "Attendance %" }
                  },
                  colors: ["#2563eb"],
                  stroke: {
                    curve: "smooth",
                    width: 3
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      colorStops: [
                        { offset: 0, color: "#2563eb", opacity: 0.4 },
                        { offset: 100, color: "#2563eb", opacity: 0.1 }
                      ]
                    }
                  },
                  dataLabels: { enabled: false },
                  grid: {
                    borderColor: "#e5e7eb"
                  }
                }}
                series={attendanceTrend.series}
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
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: "New assignment 'Math Test' created", time: "2 hours ago", type: "assignment" },
                { text: "Emily Johnson submitted Science Project", time: "4 hours ago", type: "submission" },
                { text: "Updated attendance for today", time: "6 hours ago", type: "attendance" },
                { text: "Michael Chen grade updated for History Essay", time: "1 day ago", type: "grade" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;