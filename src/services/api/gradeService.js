const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "submitted_date", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords("grade", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const grades = response.data?.map(grade => ({
        Id: grade.Id,
        studentId: grade.student_id?.Id || grade.student_id,
        assignmentId: grade.assignment_id?.Id || grade.assignment_id,
        score: grade.score,
        submittedDate: grade.submitted_date,
        comments: grade.comments
      })) || [];
      
      return grades;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching grades:", error.message);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById("grade", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Grade not found");
      }
      
      const grade = {
        Id: response.data.Id,
        studentId: response.data.student_id?.Id || response.data.student_id,
        assignmentId: response.data.assignment_id?.Id || response.data.assignment_id,
        score: response.data.score,
        submittedDate: response.data.submitted_date,
        comments: response.data.comments
      };
      
      return grade;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ],
        orderBy: [{ fieldName: "submitted_date", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords("grade", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const grades = response.data?.map(grade => ({
        Id: grade.Id,
        studentId: grade.student_id?.Id || grade.student_id,
        assignmentId: grade.assignment_id?.Id || grade.assignment_id,
        score: grade.score,
        submittedDate: grade.submitted_date,
        comments: grade.comments
      })) || [];
      
      return grades;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades for student:", error?.response?.data?.message);
      } else {
        console.error("Error fetching grades for student:", error.message);
      }
      throw error;
    }
  },

  async create(gradeData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Name: `Grade for ${gradeData.studentId}-${gradeData.assignmentId}`,
        score: gradeData.score,
        submitted_date: gradeData.submittedDate || new Date().toISOString(),
        comments: gradeData.comments || "",
        student_id: parseInt(gradeData.studentId),
        assignment_id: parseInt(gradeData.assignmentId)
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord("grade", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} grades:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            Id: created.Id,
            studentId: created.student_id,
            assignmentId: created.assignment_id,
            score: created.score,
            submittedDate: created.submitted_date,
            comments: created.comments
          };
        }
      }
      
      throw new Error("Failed to create grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error("Error creating grade:", error.message);
      }
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Id: parseInt(id),
        score: gradeData.score,
        submitted_date: gradeData.submittedDate,
        comments: gradeData.comments || "",
        student_id: parseInt(gradeData.studentId),
        assignment_id: parseInt(gradeData.assignmentId)
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord("grade", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} grades:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const updated = successfulRecords[0].data;
          return {
            Id: updated.Id,
            studentId: updated.student_id,
            assignmentId: updated.assignment_id,
            score: updated.score,
            submittedDate: updated.submitted_date,
            comments: updated.comments
          };
        }
      }
      
      throw new Error("Failed to update grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
      } else {
        console.error("Error updating grade:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("grade", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} grades:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error("Error deleting grade:", error.message);
      }
      throw error;
    }
  }
};