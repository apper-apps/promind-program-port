import { toast } from 'react-toastify'

class ToolService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'tool';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "description" } },
          { field: { "Name": "icon" } },
          { field: { "Name": "roles" } },
          { field: { "Name": "requires_vip" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } }
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
      console.error("Error fetching tools:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "description" } },
          { field: { "Name": "icon" } },
          { field: { "Name": "roles" } },
          { field: { "Name": "requires_vip" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching tool with ID ${id}:`, error);
      return null;
    }
  }

  async getByRole(role) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "description" } },
          { field: { "Name": "icon" } },
          { field: { "Name": "roles" } },
          { field: { "Name": "requires_vip" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } }
        ],
        where: [
          {
            FieldName: "roles",
            Operator: "Contains",
            Values: [role.toLowerCase()]
          }
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
      console.error("Error fetching tools by role:", error);
      throw error;
    }
  }

  async create(data) {
    try {
      const params = {
        records: [
          {
            Name: data.name,
            description: data.description,
            icon: data.icon,
            roles: data.roles,
            requires_vip: data.requires_vip || false,
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
          console.error(`Failed to create ${failedRecords.length} tools:${JSON.stringify(failedRecords)}`);
          
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
      console.error("Error creating tool:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updateData = {};
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.icon !== undefined) updateData.icon = data.icon;
      if (data.roles !== undefined) updateData.roles = data.roles;
      if (data.requires_vip !== undefined) updateData.requires_vip = data.requires_vip;
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
          console.error(`Failed to update ${failedUpdates.length} tools:${JSON.stringify(failedUpdates)}`);
          
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
      console.error("Error updating tool:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} tools:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
      throw error;
    }
  }
}

export const toolService = new ToolService()