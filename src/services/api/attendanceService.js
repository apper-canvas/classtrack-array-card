const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
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
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const attendance = response.data?.map(record => ({
        Id: record.Id,
        studentId: record.student_id?.Id || record.student_id,
        date: record.date,
        status: record.status,
        notes: record.notes
      })) || [];
      
      return attendance;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance:", error.message);
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
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById("attendance", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Attendance record not found");
      }
      
      const record = {
        Id: response.data.Id,
        studentId: response.data.student_id?.Id || response.data.student_id,
        date: response.data.date,
        status: response.data.status,
        notes: response.data.notes
      };
      
      return record;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching attendance record with ID ${id}:`, error.message);
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
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
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
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const attendance = response.data?.map(record => ({
        Id: record.Id,
        studentId: record.student_id?.Id || record.student_id,
        date: record.date,
        status: record.status,
        notes: record.notes
      })) || [];
      
      return attendance;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance for student:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance for student:", error.message);
      }
      throw error;
    }
  },

  async create(attendanceData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Name: `Attendance ${attendanceData.date} - ${attendanceData.studentId}`,
        date: attendanceData.date,
        status: attendanceData.status,
        notes: attendanceData.notes || "",
        student_id: parseInt(attendanceData.studentId)
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`);
          
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
            date: created.date,
            status: created.status,
            notes: created.notes
          };
        }
      }
      
      throw new Error("Failed to create attendance record");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message);
      } else {
        console.error("Error creating attendance record:", error.message);
      }
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Id: parseInt(id),
        date: attendanceData.date,
        status: attendanceData.status,
        notes: attendanceData.notes || "",
        student_id: parseInt(attendanceData.studentId)
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`);
          
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
            date: updated.date,
            status: updated.status,
            notes: updated.notes
          };
        }
      }
      
      throw new Error("Failed to update attendance record");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message);
      } else {
        console.error("Error updating attendance record:", error.message);
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
      
      const response = await apperClient.deleteRecord("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting attendance record:", error?.response?.data?.message);
      } else {
        console.error("Error deleting attendance record:", error.message);
      }
      throw error;
    }
  }
};