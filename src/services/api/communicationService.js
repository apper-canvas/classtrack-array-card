const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommunicationService {
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
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "date" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords("communication", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const communications = response.data?.map(comm => ({
        Id: comm.Id,
        studentId: comm.student_id?.Id || comm.student_id,
        type: comm.type,
        subject: comm.subject,
        notes: comm.notes,
        date: comm.date
      })) || [];
      
      return communications;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications:", error?.response?.data?.message);
      } else {
        console.error("Error fetching communications:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const communicationId = parseInt(id);
      if (isNaN(communicationId)) {
        throw new Error("Invalid communication ID");
      }

      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "date" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById("communication", communicationId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        return null;
      }
      
      const communication = {
        Id: response.data.Id,
        studentId: response.data.student_id?.Id || response.data.student_id,
        type: response.data.type,
        subject: response.data.subject,
        notes: response.data.notes,
        date: response.data.date
      };
      
      return communication;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching communication with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching communication with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async getByStudentId(studentId) {
    try {
      const id = parseInt(studentId);
      if (isNaN(id)) {
        throw new Error("Invalid student ID");
      }

      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "date" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [id]
          }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords("communication", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const communications = response.data?.map(comm => ({
        Id: comm.Id,
        studentId: comm.student_id?.Id || comm.student_id,
        type: comm.type,
        subject: comm.subject,
        notes: comm.notes,
        date: comm.date
      })) || [];
      
      return communications;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications for student:", error?.response?.data?.message);
      } else {
        console.error("Error fetching communications for student:", error.message);
      }
      throw error;
    }
  }

  async create(communicationData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Name: communicationData.subject || `${communicationData.type} communication`,
        type: communicationData.type || "message",
        subject: communicationData.subject || "",
        notes: communicationData.notes || "",
        date: communicationData.date || new Date().toISOString(),
        student_id: parseInt(communicationData.studentId)
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord("communication", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} communications:${JSON.stringify(failedRecords)}`);
          
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
            type: created.type,
            subject: created.subject,
            notes: created.notes,
            date: created.date
          };
        }
      }
      
      throw new Error("Failed to create communication");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating communication:", error?.response?.data?.message);
      } else {
        console.error("Error creating communication:", error.message);
      }
      throw error;
    }
  }

  async update(id, communicationData) {
    try {
      const communicationId = parseInt(id);
      if (isNaN(communicationId)) {
        throw new Error("Invalid communication ID");
      }

      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Id: communicationId,
        type: communicationData.type,
        subject: communicationData.subject || "",
        notes: communicationData.notes || "",
        date: communicationData.date,
        student_id: parseInt(communicationData.studentId)
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord("communication", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} communications:${JSON.stringify(failedRecords)}`);
          
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
            type: updated.type,
            subject: updated.subject,
            notes: updated.notes,
            date: updated.date
          };
        }
      }
      
      throw new Error("Failed to update communication");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating communication:", error?.response?.data?.message);
      } else {
        console.error("Error updating communication:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const communicationId = parseInt(id);
      if (isNaN(communicationId)) {
        throw new Error("Invalid communication ID");
      }

      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [communicationId]
      };
      
      const response = await apperClient.deleteRecord("communication", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} communications:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting communication:", error?.response?.data?.message);
      } else {
        console.error("Error deleting communication:", error.message);
      }
      throw error;
    }
  }
}

export const communicationService = new CommunicationService();