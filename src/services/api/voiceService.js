import { toast } from 'react-toastify'

class VoiceService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'recording';
  }

  async getRecordings(userId = null) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "user_id" } },
          { field: { "Name": "duration" } },
          { field: { "Name": "transcription" } },
          { field: { "Name": "timestamp" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };

      if (userId) {
        params.where = [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId.toString()]
          }
        ];
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching recordings:", error);
      throw error;
    }
  }

async saveRecording(data) {
    return await this.create({
      Name: data.transcription?.substring(0, 50) + (data.transcription?.length > 50 ? '...' : '') || 'Voice Recording',
      user_id: String(data.userId || 'anonymous'),
      duration: data.duration,
      transcription: data.transcription,
      timestamp: new Date().toISOString(),
      Tags: data.Tags || '',
      Owner: data.Owner || null
    });
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "user_id" } },
          { field: { "Name": "duration" } },
          { field: { "Name": "transcription" } },
          { field: { "Name": "timestamp" } },
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
      console.error(`Error fetching recording with ID ${id}:`, error);
      return null;
    }
  }

async create(data) {
    try {
      const params = {
        records: [
          {
            Name: data.Name,
            user_id: String(data.user_id),
            duration: data.duration,
            transcription: data.transcription,
            timestamp: data.timestamp,
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
          console.error(`Failed to create ${failedRecords.length} recordings:${JSON.stringify(failedRecords)}`);
          
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
      console.error("Error creating recording:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updateData = {};
      if (data.Name !== undefined) updateData.Name = data.Name;
      if (data.user_id !== undefined) updateData.user_id = data.user_id;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.transcription !== undefined) updateData.transcription = data.transcription;
      if (data.timestamp !== undefined) updateData.timestamp = data.timestamp;
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
          console.error(`Failed to update ${failedUpdates.length} recordings:${JSON.stringify(failedUpdates)}`);
          
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
      console.error("Error updating recording:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} recordings:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
      throw error;
    }
  }
}

export const voiceService = new VoiceService()