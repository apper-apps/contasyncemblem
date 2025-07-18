import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const invitationsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "accountant" } },
          { field: { Name: "client" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "invitationDate" } },
          { field: { Name: "expirationDate" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("invitation", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching invitations:", error?.response?.data?.message);
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
          { field: { Name: "accountant" } },
          { field: { Name: "client" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "invitationDate" } },
          { field: { Name: "expirationDate" } }
        ]
      };
      
      const response = await apperClient.getRecordById("invitation", id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching invitation with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(invitationData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Name: invitationData.Name,
        accountant: invitationData.accountant,
        client: invitationData.client,
        company: invitationData.company,
        status: invitationData.status || 'Pending',
        invitationDate: invitationData.invitationDate,
        expirationDate: invitationData.expirationDate
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord("invitation", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create invitation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating invitation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, invitationData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: invitationData.Name,
        accountant: invitationData.accountant,
        client: invitationData.client,
        company: invitationData.company,
        status: invitationData.status,
        invitationDate: invitationData.invitationDate,
        expirationDate: invitationData.expirationDate
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord("invitation", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update invitation ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating invitation:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord("invitation", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete invitation ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting invitation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
return false;
    }
  },

  async sendCredentials(invitationIds) {
    try {
      const apperClient = getApperClient();
      
      // Convert single ID to array for consistency
      const ids = Array.isArray(invitationIds) ? invitationIds : [invitationIds];
      
      // First, fetch the invitation records to get recipient details
      const invitations = [];
      for (const id of ids) {
        const invitation = await this.getById(id);
        if (invitation) {
          invitations.push(invitation);
        }
      }
      
      if (invitations.length === 0) {
        toast.error("Nu s-au găsit invitații valide pentru trimiterea credențialelor");
        return false;
      }
      
      // Process each invitation to send credentials
      const results = [];
      for (const invitation of invitations) {
        try {
          // Generate temporary credentials (this would typically integrate with your auth system)
          const tempPassword = Math.random().toString(36).substring(2, 15);
          const loginEmail = invitation.client?.Name || invitation.accountant?.Name || 'user@example.com';
          
          // In a real implementation, this would send an email with credentials
          // For now, we'll simulate the credential sending process
          console.log(`Sending credentials to ${loginEmail}:`, {
            email: loginEmail,
            temporaryPassword: tempPassword,
            invitationId: invitation.Id,
            company: invitation.company?.Name
          });
          
          // Update invitation status to 'Sent'
          const updateResult = await this.update(invitation.Id, {
            ...invitation,
            status: 'Sent'
          });
          
          if (updateResult) {
            results.push({
              id: invitation.Id,
              success: true,
              email: loginEmail
            });
          } else {
            results.push({
              id: invitation.Id,
              success: false,
              error: "Eroare la actualizarea statusului invitației"
            });
          }
        } catch (error) {
          results.push({
            id: invitation.Id,
            success: false,
            error: error.message || "Eroare la trimiterea credențialelor"
          });
        }
      }
      
      // Process results and show feedback
      const successCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`Credențialele au fost trimise cu succes pentru ${successCount} invitație${successCount > 1 ? 'i' : ''}`);
      }
      
      if (failedCount > 0) {
        const failedResults = results.filter(r => !r.success);
        console.error(`Failed to send credentials for ${failedCount} invitations:${JSON.stringify(failedResults)}`);
        
        failedResults.forEach(result => {
          toast.error(`Eroare pentru invitația ${result.id}: ${result.error}`);
        });
      }
      
      return successCount > 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error sending credentials:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error sending credentials:", error.message);
        toast.error("Eroare la trimiterea credențialelor");
      }
      return false;
    }
  }
};