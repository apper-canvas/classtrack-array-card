import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import GradeCell from "@/components/molecules/GradeCell";
import { motion } from "framer-motion";

const GradeTable = ({ students, assignments, grades }) => {
  const getGradeForStudent = (studentId, assignmentId) => {
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? grade.score : null;
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;
    
    const total = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (grade.score / assignment.points) * assignment.weight;
    }, 0);
    
    const totalWeight = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + assignment.weight;
    }, 0);
    
    return totalWeight > 0 ? Math.round((total / totalWeight) * 100) : null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 min-w-[200px]">
                  Student
                </th>
                {assignments.map((assignment) => (
                  <th key={assignment.Id} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    <div>
                      <div className="font-semibold">{assignment.title}</div>
                      <div className="text-xs text-gray-400">{assignment.points} pts</div>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Average
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
                  {assignments.map((assignment) => (
                    <td key={assignment.Id} className="px-3 py-4 text-center">
                      <GradeCell
                        score={getGradeForStudent(student.Id, assignment.Id)}
                        maxPoints={assignment.points}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <div className="font-semibold text-gray-900">
                      {calculateStudentAverage(student.Id) ? `${calculateStudentAverage(student.Id)}%` : "-"}
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

export default GradeTable;