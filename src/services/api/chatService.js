import React from "react";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { openRouterService } from "@/services/api/openRouterService";
import { mockMessages } from "@/services/mockData/messages.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ChatService {
  constructor() {
    this.messages = [...mockMessages]
  }

  async getChatHistory(userId = null) {
    await delay(300)
    if (userId) {
      return this.messages
        .filter(msg => msg.userId === userId)
        .map(msg => ({ ...msg }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    }
    
    return this.messages
      .map(msg => ({ ...msg }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

async sendMessage(message, useAI = false) {
    await delay(200)
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      ...message,
      timestamp: new Date().toISOString()
    }
    
    this.messages.push(newMessage)
    
    // If this is a user message and AI is enabled, generate AI response
    if (useAI && message.sender === 'user') {
      try {
        const apiKey = await userService.getOpenRouterApiKey()
        let aiContent = ''
        
        if (apiKey) {
          try {
            aiContent = await openRouterService.sendChatMessage(
              message.content,
              message.userRole,
              apiKey
            )
          } catch (error) {
            console.error('OpenRouter API failed, using fallback:', error)
            aiContent = this.generateFallbackResponse(message.content, message.userRole)
          }
        } else {
          aiContent = this.generateFallbackResponse(message.content, message.userRole)
        }
        
        const aiResponse = {
          Id: Math.max(...this.messages.map(m => m.Id)) + 1,
          content: aiContent,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          userId: message.userId
        }
        
        this.messages.push(aiResponse)
        return { userMessage: { ...newMessage }, aiResponse: { ...aiResponse } }
      } catch (error) {
        console.error('Failed to generate AI response:', error)
      }
    }
    
    return { ...newMessage }
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
    }

    const roleResponses = responses[userRole?.toLowerCase()] || responses.default
    return roleResponses[Math.floor(Math.random() * roleResponses.length)]
  }

  async getById(id) {
    await delay(250)
    const message = this.messages.find(m => m.Id === id)
    if (!message) {
      throw new Error('Message not found')
    }
    return { ...message }
  }

  async create(data) {
    await delay(300)
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      ...data,
      timestamp: new Date().toISOString()
    }
    
    this.messages.push(newMessage)
    return { ...newMessage }
  }

  async update(id, data) {
    await delay(400)
    const messageIndex = this.messages.findIndex(m => m.Id === id)
    if (messageIndex === -1) {
      throw new Error('Message not found')
    }
    
    this.messages[messageIndex] = {
      ...this.messages[messageIndex],
      ...data
    }
    
    return { ...this.messages[messageIndex] }
  }

  async delete(id) {
    await delay(300)
    const messageIndex = this.messages.findIndex(m => m.Id === id)
    if (messageIndex === -1) {
      throw new Error('Message not found')
    }
    
    this.messages.splice(messageIndex, 1)
    return true
  }

  async clearHistory(userId = null) {
    await delay(300)
    if (userId) {
      this.messages = this.messages.filter(msg => msg.userId !== userId)
    } else {
      this.messages = []
    }
    return true
  }
}

export const chatService = new ChatService()