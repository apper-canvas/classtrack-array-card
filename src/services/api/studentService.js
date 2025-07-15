const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "grade_level" } },
          { field: { Name: "date_enrolled" } },
          { field: { Name: "status" } },
          { field: { Name: "parent_name" } },
          { field: { Name: "parent_email" } },
          { field: { Name: "parent_phone" } }
        ],
        orderBy: [{ fieldName: "last_name", sorttype: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords("student", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      const students = response.data?.map(student => ({
        Id: student.Id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        phone: student.phone,
        gradeLevel: student.grade_level,
        dateEnrolled: student.date_enrolled,
        status: student.status,
        parentName: student.parent_name,
        parentEmail: student.parent_email,
        parentPhone: student.parent_phone
      })) || [];
      
      return students;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error("Error fetching students:", error.message);
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "grade_level" } },
          { field: { Name: "date_enrolled" } },
          { field: { Name: "status" } },
          { field: { Name: "parent_name" } },
          { field: { Name: "parent_email" } },
          { field: { Name: "parent_phone" } }
        ]
      };
      
      const response = await apperClient.getRecordById("student", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Student not found");
      }
      
      // Transform database fields to UI format
      const student = {
        Id: response.data.Id,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        email: response.data.email,
        phone: response.data.phone,
        gradeLevel: response.data.grade_level,
        dateEnrolled: response.data.date_enrolled,
        status: response.data.status,
        parentName: response.data.parent_name,
        parentEmail: response.data.parent_email,
        parentPhone: response.data.parent_phone
      };
      
      return student;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching student with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(studentData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Transform UI format to database fields (only Updateable fields)
      const dbData = {
        Name: `${studentData.firstName} ${studentData.lastName}`,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone,
        grade_level: studentData.gradeLevel,
        date_enrolled: studentData.dateEnrolled || new Date().toISOString(),
        status: studentData.status || "Active",
        parent_name: studentData.parentName || "",
        parent_email: studentData.parentEmail || "",
        parent_phone: studentData.parentPhone || ""
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord("student", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} students:${JSON.stringify(failedRecords)}`);
          
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
            firstName: created.first_name,
            lastName: created.last_name,
            email: created.email,
            phone: created.phone,
            gradeLevel: created.grade_level,
            dateEnrolled: created.date_enrolled,
            status: created.status,
            parentName: created.parent_name,
            parentEmail: created.parent_email,
            parentPhone: created.parent_phone
          };
        }
      }
      
      throw new Error("Failed to create student");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error("Error creating student:", error.message);
      }
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Transform UI format to database fields (only Updateable fields)
      const dbData = {
        Id: parseInt(id),
        Name: `${studentData.firstName} ${studentData.lastName}`,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone,
        grade_level: studentData.gradeLevel,
        date_enrolled: studentData.dateEnrolled,
        status: studentData.status,
        parent_name: studentData.parentName || "",
        parent_email: studentData.parentEmail || "",
        parent_phone: studentData.parentPhone || ""
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord("student", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} students:${JSON.stringify(failedRecords)}`);
          
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
            firstName: updated.first_name,
            lastName: updated.last_name,
            email: updated.email,
            phone: updated.phone,
            gradeLevel: updated.grade_level,
            dateEnrolled: updated.date_enrolled,
            status: updated.status,
            parentName: updated.parent_name,
            parentEmail: updated.parent_email,
            parentPhone: updated.parent_phone
          };
        }
      }
      
      throw new Error("Failed to update student");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
      } else {
        console.error("Error updating student:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("student", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} students:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error("Error deleting student:", error.message);
      }
      throw error;
    }
  }
};