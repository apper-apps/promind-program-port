import { toast } from 'react-toastify'

class UserService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_User';
    this.openRouterApiKey = null;
  }

  async getAll() {
    try {
      const params = {
fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "email" } },
          { field: { "Name": "role" } },
          { field: { "Name": "plan" } },
          { field: { "Name": "joined_date" } },
          { field: { "Name": "last_active" } },
          { field: { "Name": "open_router_api_key" } },
          { field: { "Name": "last_login_time" } },
          { field: { "Name": "failed_login_attempts" } },
          { field: { "Name": "session_token" } },
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
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "email" } },
          { field: { "Name": "role" } },
          { field: { "Name": "plan" } },
          { field: { "Name": "joined_date" } },
          { field: { "Name": "last_active" } },
          { field: { "Name": "open_router_api_key" } },
          { field: { "Name": "last_login_time" } },
          { field: { "Name": "failed_login_attempts" } },
          { field: { "Name": "session_token" } },
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
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
  }

async create(data) {
    try {
      const params = {
        records: [
          {
            Name: data.Name || data.name,
            email: data.email,
            role: data.role,
            plan: data.plan || 'free',
            joined_date: data.joined_date || new Date().toISOString(),
            last_active: new Date().toISOString(),
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
      
      if (response.results && Array.isArray(response.results)) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} users:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
      return null;
    }
  }

  async update(id, data) {
    try {
const updateData = {};
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.role !== undefined) updateData.role = data.role;
      if (data.plan !== undefined) updateData.plan = data.plan;
      if (data.last_login_time !== undefined) updateData.last_login_time = data.last_login_time;
      if (data.failed_login_attempts !== undefined) updateData.failed_login_attempts = data.failed_login_attempts;
      if (data.session_token !== undefined) updateData.session_token = data.session_token;
      if (data.Tags !== undefined) updateData.Tags = data.Tags;
      if (data.Owner !== undefined) updateData.Owner = data.Owner;
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData,
            last_active: new Date().toISOString()
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
          console.error(`Failed to update ${failedUpdates.length} users:${JSON.stringify(failedUpdates)}`);
          
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
      console.error("Error updating user:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} users:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    // In a real implementation, this would get the current authenticated user
    // For now, return the first user as a placeholder
    try {
      const users = await this.getAll();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async updateUserRole(role) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      return await this.update(currentUser.Id, { role });
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  }

  async updateUserPlan(plan) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      return await this.update(currentUser.Id, { plan });
    } catch (error) {
      console.error('Failed to update user plan:', error);
      throw error;
    }
  }

  async updateOpenRouterApiKey(apiKey) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      if (currentUser.role !== 'admin') {
        throw new Error('Only admin users can update API key');
      }
      
      this.openRouterApiKey = apiKey;
      const maskedKey = apiKey ? '***' + apiKey.slice(-4) : null;
      
      return await this.update(currentUser.Id, { 
        open_router_api_key: maskedKey 
      });
    } catch (error) {
      console.error('Failed to update API key:', error);
      throw error;
    }
  }

  async getOpenRouterApiKey() {
    return this.openRouterApiKey;
  }

  async clearOpenRouterApiKey() {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      if (currentUser.role !== 'admin') {
        throw new Error('Only admin users can clear API key');
      }
      
      this.openRouterApiKey = null;
      
      return await this.update(currentUser.Id, { 
        open_router_api_key: null 
      });
    } catch (error) {
      console.error('Failed to clear API key:', error);
      throw error;
    }
  }
}

export const userService = new UserService()