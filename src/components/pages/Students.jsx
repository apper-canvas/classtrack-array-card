import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const { onMenuClick } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleViewStudent = (student) => {
    toast.info(`Viewing ${student.firstName} ${student.lastName}`);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success("Student deleted successfully");
        loadStudents();
      } catch (err) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (modalMode === "add") {
        await studentService.create(studentData);
        toast.success("Student added successfully");
      } else {
        await studentService.update(selectedStudent.Id, studentData);
        toast.success("Student updated successfully");
      }
      setModalOpen(false);
      loadStudents();
    } catch (err) {
      toast.error("Failed to save student");
    }
  };

  const headerActions = [
    {
      label: "Add Student",
      icon: "Plus",
      onClick: handleAddStudent,
      variant: "primary"
    },
    {
      label: "Export",
      icon: "Download",
      onClick: () => toast.info("Export functionality coming soon"),
      variant: "outline"
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <Header
        title="Students"
        subtitle={`Manage your ${students.length} students`}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuClick={onMenuClick}
        actions={headerActions}
      />

      {filteredStudents.length === 0 && searchTerm === "" ? (
        <Empty
          title="No students found"
          description="Start building your class roster by adding your first student."
          actionText="Add Student"
          onAction={handleAddStudent}
          icon="Users"
        />
      ) : filteredStudents.length === 0 ? (
        <Empty
          title="No matching students"
          description="Try adjusting your search criteria to find students."
          icon="Search"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}

      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
        mode={modalMode}
      />
    </div>
  );
};

export default Students;