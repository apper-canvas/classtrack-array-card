import { studentService } from "./studentService";

class ParentService {
  async getByStudentId(studentId) {
    const id = parseInt(studentId);
    if (isNaN(id)) {
      throw new Error("Invalid student ID");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const student = await studentService.getById(id);
      if (!student) {
        throw new Error("Student not found");
      }

      return {
        studentId: student.Id,
        parentName: student.parentName || "",
        parentEmail: student.parentEmail || "",
        parentPhone: student.parentPhone || ""
      };
    } catch (error) {
      throw new Error("Failed to fetch parent information");
    }
  }

  async updateParent(studentId, parentData) {
    const id = parseInt(studentId);
    if (isNaN(id)) {
      throw new Error("Invalid student ID");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const student = await studentService.getById(id);
      if (!student) {
        throw new Error("Student not found");
      }

      const updatedStudent = {
        ...student,
        parentName: parentData.parentName || "",
        parentEmail: parentData.parentEmail || "",
        parentPhone: parentData.parentPhone || ""
      };

      await studentService.update(id, updatedStudent);
      
      return {
        studentId: id,
        parentName: updatedStudent.parentName,
        parentEmail: updatedStudent.parentEmail,
        parentPhone: updatedStudent.parentPhone
      };
    } catch (error) {
      throw new Error("Failed to update parent information");
    }
  }
}

export const parentService = new ParentService();