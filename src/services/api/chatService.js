import { mockMessages } from '@/services/mockData/messages.json'

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

  async sendMessage(message) {
    await delay(200)
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      ...message,
      timestamp: new Date().toISOString()
    }
    
    this.messages.push(newMessage)
    return { ...newMessage }
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