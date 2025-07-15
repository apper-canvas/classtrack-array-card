const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
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
          { field: { Name: "title" } },
          { field: { Name: "category" } },
          { field: { Name: "points" } },
          { field: { Name: "due_date" } },
          { field: { Name: "weight" } }
        ],
        orderBy: [{ fieldName: "due_date", sorttype: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords("assignment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const assignments = response.data?.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title,
        category: assignment.category,
        points: assignment.points,
        dueDate: assignment.due_date,
        weight: assignment.weight
      })) || [];
      
      return assignments;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments:", error.message);
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
          { field: { Name: "title" } },
          { field: { Name: "category" } },
          { field: { Name: "points" } },
          { field: { Name: "due_date" } },
          { field: { Name: "weight" } }
        ]
      };
      
      const response = await apperClient.getRecordById("assignment", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Assignment not found");
      }
      
      const assignment = {
        Id: response.data.Id,
        title: response.data.title,
        category: response.data.category,
        points: response.data.points,
        dueDate: response.data.due_date,
        weight: response.data.weight
      };
      
      return assignment;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching assignment with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Name: assignmentData.title,
        title: assignmentData.title,
        category: assignmentData.category,
        points: assignmentData.points,
        due_date: assignmentData.dueDate,
        weight: assignmentData.weight
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.createRecord("assignment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} assignments:${JSON.stringify(failedRecords)}`);
          
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
            title: created.title,
            category: created.category,
            points: created.points,
            dueDate: created.due_date,
            weight: created.weight
          };
        }
      }
      
      throw new Error("Failed to create assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error creating assignment:", error.message);
      }
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const dbData = {
        Id: parseInt(id),
        Name: assignmentData.title,
        title: assignmentData.title,
        category: assignmentData.category,
        points: assignmentData.points,
        due_date: assignmentData.dueDate,
        weight: assignmentData.weight
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await apperClient.updateRecord("assignment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} assignments:${JSON.stringify(failedRecords)}`);
          
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
            title: updated.title,
            category: updated.category,
            points: updated.points,
            dueDate: updated.due_date,
            weight: updated.weight
          };
        }
      }
      
      throw new Error("Failed to update assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error updating assignment:", error.message);
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
      
      const response = await apperClient.deleteRecord("assignment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} assignments:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting assignment:", error.message);
      }
      throw error;
    }
  }
};