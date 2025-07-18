import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const messagesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read" } },
          { field: { Name: "company_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("message", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching messages:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching messages:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea mesajelor");
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read" } },
          { field: { Name: "company_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById("message", id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
} catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching message with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching message with ID ${id}:`, error?.message || "Unknown error");
        toast.error("Eroare la încărcarea mesajului");
      }
      return null;
    }
  },

  async create(messageData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Name: messageData.Name,
        Tags: messageData.Tags,
        Owner: messageData.Owner,
        sender_id: messageData.sender_id,
        type: messageData.type,
        subject: messageData.subject,
        content: messageData.content,
        timestamp: messageData.timestamp,
        read: messageData.read,
        company_id: parseInt(messageData.company_id?.Id || messageData.company_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord("message", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create message ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating message:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating message:", error?.message || "Unknown error");
        toast.error("Eroare la crearea mesajului");
      }
      return null;
    }
  },

  async update(id, messageData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: messageData.Name,
        Tags: messageData.Tags,
        Owner: messageData.Owner,
        sender_id: messageData.sender_id,
        type: messageData.type,
        subject: messageData.subject,
        content: messageData.content,
        timestamp: messageData.timestamp,
        read: messageData.read,
        company_id: parseInt(messageData.company_id?.Id || messageData.company_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord("message", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update message ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      return null;
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating message:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating message:", error?.message || "Unknown error");
        toast.error("Eroare la actualizarea mesajului");
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("message", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete message ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting message:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting message:", error?.message || "Unknown error");
        toast.error("Eroare la ștergerea mesajului");
      }
      return false;
    }
  },

  async getByCompanyId(companyId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "type" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read" } },
          { field: { Name: "company_id" } }
        ],
        where: [
          {
            FieldName: "company_id",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("message", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
} catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching messages by company ID:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching messages by company ID:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea mesajelor companiei");
      }
      return [];
    }
  }
};