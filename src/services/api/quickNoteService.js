import { toast } from 'react-toastify'

class QuickNoteService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'quick_note';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "content" } },
          { field: { "Name": "timestamp" } },
          { 
            field: { "Name": "text_tool" },
            referenceField: { field: { "Name": "Name" } }
          },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching quick notes:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "content" } },
          { field: { "Name": "timestamp" } },
          { 
            field: { "Name": "text_tool" },
            referenceField: { field: { "Name": "Name" } }
          },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "ModifiedOn" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching quick note with ID ${id}:`, error);
      return null;
    }
  }

  async create(data) {
    try {
      const params = {
        records: [
          {
            Name: data.name || `Note ${new Date().toLocaleDateString()}`,
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
            text_tool: data.text_tool ? parseInt(data.text_tool) : null,
            Tags: data.Tags || '',
            Owner: data.Owner || null
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} quick notes:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating quick note:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updateData = {};
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.timestamp !== undefined) updateData.timestamp = data.timestamp;
      if (data.text_tool !== undefined) updateData.text_tool = data.text_tool ? parseInt(data.text_tool) : null;
      if (data.Tags !== undefined) updateData.Tags = data.Tags;
      if (data.Owner !== undefined) updateData.Owner = data.Owner;
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} quick notes:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating quick note:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} quick notes:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting quick note:", error);
      throw error;
    }
  }
}

export const quickNoteService = new QuickNoteService()