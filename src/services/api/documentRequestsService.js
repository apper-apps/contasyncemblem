import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const documentRequestsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_id" } },
          { field: { Name: "document_type" } },
          { field: { Name: "request_date" } },
          { field: { Name: "request_status" } },
          { field: { Name: "note" } },
          { field: { Name: "accountant_id" } },
          { field: { Name: "client_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching document requests:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching document requests:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea cererilor de documente");
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
          { field: { Name: "company_id" } },
          { field: { Name: "document_type" } },
          { field: { Name: "request_date" } },
          { field: { Name: "request_status" } },
          { field: { Name: "note" } },
          { field: { Name: "accountant_id" } },
          { field: { Name: "client_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById("documentrequest", id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching document request with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching document request with ID ${id}:`, error?.message || "Unknown error");
        toast.error("Eroare la încărcarea cererii de documente");
      }
      return null;
    }
  },

  async create(documentRequestData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Name: documentRequestData.Name,
        Tags: documentRequestData.Tags,
        Owner: documentRequestData.Owner,
        company_id: parseInt(documentRequestData.company_id?.Id || documentRequestData.company_id),
        document_type: documentRequestData.document_type,
        request_date: documentRequestData.request_date,
        request_status: documentRequestData.request_status || "În așteptare",
        note: documentRequestData.note,
        accountant_id: parseInt(documentRequestData.accountant_id?.Id || documentRequestData.accountant_id),
        client_id: parseInt(documentRequestData.client_id?.Id || documentRequestData.client_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create document request ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating document request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating document request:", error?.message || "Unknown error");
        toast.error("Eroare la crearea cererii de documente");
      }
      return null;
    }
  },

  async update(id, documentRequestData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: documentRequestData.Name,
        Tags: documentRequestData.Tags,
        Owner: documentRequestData.Owner,
        company_id: parseInt(documentRequestData.company_id?.Id || documentRequestData.company_id),
        document_type: documentRequestData.document_type,
        request_date: documentRequestData.request_date,
        request_status: documentRequestData.request_status,
        note: documentRequestData.note,
        accountant_id: parseInt(documentRequestData.accountant_id?.Id || documentRequestData.accountant_id),
        client_id: parseInt(documentRequestData.client_id?.Id || documentRequestData.client_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update document request ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating document request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating document request:", error?.message || "Unknown error");
        toast.error("Eroare la actualizarea cererii de documente");
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
      
      const response = await apperClient.deleteRecord("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete document request ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting document request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting document request:", error?.message || "Unknown error");
        toast.error("Eroare la ștergerea cererii de documente");
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
          { field: { Name: "company_id" } },
          { field: { Name: "document_type" } },
          { field: { Name: "request_date" } },
          { field: { Name: "request_status" } },
          { field: { Name: "note" } },
          { field: { Name: "accountant_id" } },
          { field: { Name: "client_id" } }
        ],
        where: [
          {
            FieldName: "company_id",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching document requests by company ID:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching document requests by company ID:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea cererilor de documente ale companiei");
      }
      return [];
    }
  },

  async getByAccountantId(accountantId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_id" } },
          { field: { Name: "document_type" } },
          { field: { Name: "request_date" } },
          { field: { Name: "request_status" } },
          { field: { Name: "note" } },
          { field: { Name: "accountant_id" } },
          { field: { Name: "client_id" } }
        ],
        where: [
          {
            FieldName: "accountant_id",
            Operator: "EqualTo",
            Values: [parseInt(accountantId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching document requests by accountant ID:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching document requests by accountant ID:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea cererilor contabilului");
      }
      return [];
    }
  },

  async getByClientId(clientId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_id" } },
          { field: { Name: "document_type" } },
          { field: { Name: "request_date" } },
          { field: { Name: "request_status" } },
          { field: { Name: "note" } },
          { field: { Name: "accountant_id" } },
          { field: { Name: "client_id" } }
        ],
        where: [
          {
            FieldName: "client_id",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("documentrequest", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching document requests by client ID:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching document requests by client ID:", error?.message || "Unknown error");
        toast.error("Eroare la încărcarea cererilor clientului");
      }
      return [];
    }
  }
};