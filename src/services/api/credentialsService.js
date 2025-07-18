import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const credentialsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } },
          { field: { Name: "company" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("credential", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching credentials:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching credentials:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea credențialelor");
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
          { field: { Name: "username" } },
          { field: { Name: "password" } },
          { field: { Name: "company" } }
        ]
      };
      
      const response = await apperClient.getRecordById("credential", id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching credential with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching credential with ID ${id}:`, error?.message || "Unknown error");
        toast.error("Eroare la încărcarea credențialei");
      }
      return null;
    }
  },

  async create(credentialData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Name: credentialData.Name,
        Tags: credentialData.Tags,
        Owner: credentialData.Owner,
        username: credentialData.username,
        password: credentialData.password,
        company: parseInt(credentialData.company?.Id || credentialData.company)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord("credential", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create credential ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating credential:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating credential:", error?.message || "Unknown error");
        toast.error("Eroare la crearea credențialei");
      }
      return null;
    }
  },

  async update(id, credentialData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: credentialData.Name,
        Tags: credentialData.Tags,
        Owner: credentialData.Owner,
        username: credentialData.username,
        password: credentialData.password,
        company: parseInt(credentialData.company?.Id || credentialData.company)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord("credential", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update credential ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating credential:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating credential:", error?.message || "Unknown error");
        toast.error("Eroare la actualizarea credențialei");
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
      
      const response = await apperClient.deleteRecord("credential", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete credential ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting credential:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting credential:", error?.message || "Unknown error");
        toast.error("Eroare la ștergerea credențialei");
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
          { field: { Name: "username" } },
          { field: { Name: "password" } },
          { field: { Name: "company" } }
        ],
        where: [
          {
            FieldName: "company",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("credential", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching credentials by company ID:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching credentials by company ID:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea credențialelor companiei");
      }
      return [];
    }
  }
};