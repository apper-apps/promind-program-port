import { mockUsers } from '@/services/mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  constructor() {
    this.users = [...mockUsers]
    this.currentUserId = 1 // Simulate logged in user
  }

  async getCurrentUser() {
    await delay(300)
    const user = this.users.find(u => u.Id === this.currentUserId)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  async updateUserRole(role) {
    await delay(400)
    const userIndex = this.users.findIndex(u => u.Id === this.currentUserId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      role,
      lastActive: new Date().toISOString()
    }
    
    return { ...this.users[userIndex] }
  }

  async updateUserPlan(plan) {
    await delay(400)
    const userIndex = this.users.findIndex(u => u.Id === this.currentUserId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      plan,
      lastActive: new Date().toISOString()
    }
    
    return { ...this.users[userIndex] }
  }

  async getAll() {
    await delay(300)
    return this.users.map(user => ({ ...user }))
  }

  async getById(id) {
    await delay(250)
    const user = this.users.find(u => u.Id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  async create(data) {
    await delay(400)
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      ...data,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
    
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, data) {
    await delay(400)
    const userIndex = this.users.findIndex(u => u.Id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
      lastActive: new Date().toISOString()
    }
    
    return { ...this.users[userIndex] }
  }

  async delete(id) {
    await delay(300)
    const userIndex = this.users.findIndex(u => u.Id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    this.users.splice(userIndex, 1)
    return true
  }
}

export const userService = new UserService()