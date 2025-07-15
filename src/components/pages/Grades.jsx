import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import GradeTable from "@/components/organisms/GradeTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Grades = () => {
  const { onMenuClick } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGradeData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "Active"));
      setGrades(gradesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message || "Failed to load grade data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradeData();
  }, []);

  const headerActions = [
    {
      label: "Add Assignment",
      icon: "Plus",
      onClick: () => toast.info("Add Assignment functionality coming soon"),
      variant: "primary"
    },
    {
      label: "Import Grades",
      icon: "Upload",
      onClick: () => toast.info("Import functionality coming soon"),
      variant: "outline"
    },
    {
      label: "Export",
      icon: "Download",
      onClick: () => toast.info("Export functionality coming soon"),
      variant: "outline"
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadGradeData} />;

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <Header
          title="Grades"
          subtitle="Track and manage student grades"
          onMenuClick={onMenuClick}
          actions={headerActions}
        />
        <Empty
          title="No active students"
          description="Add students to your roster before managing grades."
          actionText="Go to Students"
          onAction={() => window.location.href = "/students"}
          icon="BookOpen"
        />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-6">
        <Header
          title="Grades"
          subtitle="Track and manage student grades"
          onMenuClick={onMenuClick}
          actions={headerActions}
        />
        <Empty
          title="No assignments created"
          description="Create your first assignment to start tracking grades."
          actionText="Add Assignment"
          onAction={() => toast.info("Add Assignment functionality coming soon")}
          icon="BookOpen"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Grades"
        subtitle={`Grade tracking for ${students.length} students across ${assignments.length} assignments`}
        onMenuClick={onMenuClick}
        actions={headerActions}
      />

      <GradeTable
        students={students}
        assignments={assignments}
        grades={grades}
      />
    </div>
  );
};

export default Grades;