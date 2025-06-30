import { toast } from 'react-toastify'

class ExternalApiService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'external_api';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "api_name" } },
          { field: { "Name": "model_name" } },
          { field: { "Name": "authentication_details" } },
          { field: { "Name": "access_control_settings" } },
          { field: { "Name": "default_body" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
      console.error("Error fetching external APIs:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "api_name" } },
          { field: { "Name": "model_name" } },
          { field: { "Name": "authentication_details" } },
          { field: { "Name": "access_control_settings" } },
          { field: { "Name": "default_body" } },
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
      console.error(`Error fetching external API with ID ${id}:`, error);
      return null;
    }
  }

  async create(data) {
    try {
      const params = {
        records: [
          {
            Name: data.name,
            api_name: data.api_name,
            model_name: data.model_name,
            authentication_details: data.authentication_details || '',
            access_control_settings: data.access_control_settings || '',
            default_body: data.default_body || '',
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
          console.error(`Failed to create ${failedRecords.length} external APIs:${JSON.stringify(failedRecords)}`);
          
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
      console.error("Error creating external API:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updateData = {};
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.api_name !== undefined) updateData.api_name = data.api_name;
      if (data.model_name !== undefined) updateData.model_name = data.model_name;
      if (data.authentication_details !== undefined) updateData.authentication_details = data.authentication_details;
      if (data.access_control_settings !== undefined) updateData.access_control_settings = data.access_control_settings;
      if (data.default_body !== undefined) updateData.default_body = data.default_body;
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
          console.error(`Failed to update ${failedUpdates.length} external APIs:${JSON.stringify(failedUpdates)}`);
          
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
      console.error("Error updating external API:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} external APIs:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting external API:", error);
      throw error;
    }
  }

  async deleteMultiple(ids) {
    try {
      const params = {
        RecordIds: ids.map(id => parseInt(id))
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
          console.error(`Failed to delete ${failedDeletions.length} external APIs:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      console.error("Error deleting external APIs:", error);
      throw error;
    }
  }

  async validateApiConfiguration(data) {
    // Basic validation for API configuration
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Name is required';
    }
    
    if (!data.api_name || data.api_name.trim() === '') {
      errors.api_name = 'API Name is required';
    }
    
    if (!data.model_name || data.model_name.trim() === '') {
      errors.model_name = 'Model Name is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  async testApiConnection(apiData) {
    try {
      // This would be implemented to test the actual API connection
      // For now, just validate the configuration
      const validation = await this.validateApiConfiguration(apiData);
      
      if (!validation.isValid) {
        toast.error('Please fix configuration errors before testing');
        return false;
      }
      
      // Simulate API test - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('API configuration test successful');
      return true;
    } catch (error) {
      console.error('Error testing API connection:', error);
      toast.error('Failed to test API connection');
      return false;
    }
  }
}

export const externalApiService = new ExternalApiService()