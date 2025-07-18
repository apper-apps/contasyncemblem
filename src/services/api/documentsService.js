import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const documentsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "month" } },
          { field: { Name: "year" } },
          { field: { Name: "type" } },
          { field: { Name: "file_name" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "physical_sent_date" } },
          { field: { Name: "physical_received_date" } },
          { field: { Name: "status" } },
          { field: { Name: "company_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("document", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching documents:", error?.response?.data?.message);
      } else {
        console.error(error.message);
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
          { field: { Name: "month" } },
          { field: { Name: "year" } },
          { field: { Name: "type" } },
          { field: { Name: "file_name" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "physical_sent_date" } },
          { field: { Name: "physical_received_date" } },
          { field: { Name: "status" } },
          { field: { Name: "company_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById("document", id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching document with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(documentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Name: documentData.Name,
        Tags: documentData.Tags,
        Owner: documentData.Owner,
        month: documentData.month,
        year: documentData.year,
        type: documentData.type,
        file_name: documentData.file_name,
        upload_date: documentData.upload_date,
        physical_sent_date: documentData.physical_sent_date,
        physical_received_date: documentData.physical_received_date,
        status: documentData.status,
        company_id: parseInt(documentData.company_id?.Id || documentData.company_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord("document", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create document ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating document:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, documentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: documentData.Name,
        Tags: documentData.Tags,
        Owner: documentData.Owner,
        month: documentData.month,
        year: documentData.year,
        type: documentData.type,
        file_name: documentData.file_name,
        upload_date: documentData.upload_date,
        physical_sent_date: documentData.physical_sent_date,
        physical_received_date: documentData.physical_received_date,
        status: documentData.status,
        company_id: parseInt(documentData.company_id?.Id || documentData.company_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord("document", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update document ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating document:", error?.response?.data?.message);
      } else {
        console.error(error.message);
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
      
      const response = await apperClient.deleteRecord("document", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete document ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting document:", error?.response?.data?.message);
      } else {
        console.error(error.message);
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
          { field: { Name: "month" } },
          { field: { Name: "year" } },
          { field: { Name: "type" } },
          { field: { Name: "file_name" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "physical_sent_date" } },
          { field: { Name: "physical_received_date" } },
          { field: { Name: "status" } },
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
      
      const response = await apperClient.fetchRecords("document", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching documents by company ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};