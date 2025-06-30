import { toast } from 'react-toastify'
import { userService } from '@/services/api/userService'
import { openRouterService } from '@/services/api/openRouterService'

class ChatService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'message';
  }

  async getChatHistory(userId = null) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "user_id" } },
          { field: { "Name": "content" } },
          { field: { "Name": "sender" } },
          { field: { "Name": "timestamp" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "ASC" }
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
      console.error("Error fetching chat history:", error);
      throw error;
    }
  }

  async sendMessage(message, useAI = false) {
    try {
      const newMessage = await this.create({
        Name: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
        user_id: message.userId || 'anonymous',
        content: message.content,
        sender: message.sender,
        timestamp: new Date().toISOString(),
        Tags: message.Tags || '',
        Owner: message.Owner || null
      });

      // If this is a user message and AI is enabled, generate AI response
      if (useAI && message.sender === 'user' && newMessage) {
        try {
          const apiKey = await userService.getOpenRouterApiKey();
          let aiContent = '';
          
          if (apiKey) {
            try {
              aiContent = await openRouterService.sendChatMessage(
                message.content,
                message.userRole,
                apiKey
              );
            } catch (error) {
              console.error('OpenRouter API failed, using fallback:', error);
              aiContent = this.generateFallbackResponse(message.content, message.userRole);
            }
          } else {
            aiContent = this.generateFallbackResponse(message.content, message.userRole);
          }
          
          const aiResponse = await this.create({
            Name: aiContent.substring(0, 50) + (aiContent.length > 50 ? '...' : ''),
            user_id: message.userId || 'anonymous',
            content: aiContent,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            Tags: message.Tags || '',
            Owner: message.Owner || null
          });
          
          return { userMessage: newMessage, aiResponse: aiResponse };
        } catch (error) {
          console.error('Failed to generate AI response:', error);
        }
      }
      
      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  generateFallbackResponse(message, userRole) {
    const responses = {
      doctor: [
        "As a medical professional, I'd be happy to help with your inquiry. However, please remember that this is for informational purposes only.",
        "Based on your question, here are some general guidelines that might be helpful for healthcare professionals...",
        "In medical practice, it's important to consider multiple factors. Let me provide some insights..."
      ],
      engineer: [
        "From an engineering perspective, this is an interesting problem. Let me break down the technical aspects...",
        "This requires careful consideration of the design parameters. Here's my analysis...",
        "In engineering, we need to consider efficiency and safety. Let me provide some technical insights..."
      ],
      developer: [
        "This is a great programming question! Let me help you with a solution approach...",
        "From a software development standpoint, there are several ways to tackle this...",
        "Here's how I would approach this coding challenge with best practices..."
      ],
      default: [
        "That's an interesting question! Let me help you with that...",
        "Based on your inquiry, here are some thoughts and suggestions...",
        "I'd be happy to assist you with this. Here's what I think..."
      ]
    };

    const roleResponses = responses[userRole?.toLowerCase()] || responses.default;
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "user_id" } },
          { field: { "Name": "content" } },
          { field: { "Name": "sender" } },
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
      console.error(`Error fetching message with ID ${id}:`, error);
      return null;
    }
  }

  async create(data) {
    try {
      const params = {
        records: [
          {
            Name: data.Name,
            user_id: data.user_id,
            content: data.content,
            sender: data.sender,
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
          console.error(`Failed to create ${failedRecords.length} messages:${JSON.stringify(failedRecords)}`);
          
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
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updateData = {};
      if (data.Name !== undefined) updateData.Name = data.Name;
      if (data.user_id !== undefined) updateData.user_id = data.user_id;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.sender !== undefined) updateData.sender = data.sender;
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
          console.error(`Failed to update ${failedUpdates.length} messages:${JSON.stringify(failedUpdates)}`);
          
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
      console.error("Error updating message:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} messages:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  async clearHistory(userId = null) {
    try {
      // Get all messages for the user
      const messages = await this.getChatHistory(userId);
      
      if (messages.length === 0) {
        return true;
      }
      
      // Delete all messages
      const messageIds = messages.map(msg => msg.Id);
      const params = {
        RecordIds: messageIds
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw error;
    }
  }
}

export const chatService = new ChatService()
export const chatService = new ChatService()