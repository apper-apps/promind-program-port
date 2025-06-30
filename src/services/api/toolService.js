import { mockTools } from '@/services/mockData/tools.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ToolService {
  constructor() {
    this.tools = [...mockTools]
  }

  async getAll() {
    await delay(300)
    return this.tools.map(tool => ({ ...tool }))
  }

  async getById(id) {
    await delay(250)
    const tool = this.tools.find(t => t.Id === id)
    if (!tool) {
      throw new Error('Tool not found')
    }
    return { ...tool }
  }

  async getByRole(role) {
    await delay(300)
    const filteredTools = this.tools.filter(tool => 
      tool.roles.includes(role.toLowerCase())
    )
    return filteredTools.map(tool => ({ ...tool }))
  }

  async create(data) {
    await delay(400)
    const newTool = {
      Id: Math.max(...this.tools.map(t => t.Id)) + 1,
      ...data
    }
    
    this.tools.push(newTool)
    return { ...newTool }
  }

  async update(id, data) {
    await delay(400)
    const toolIndex = this.tools.findIndex(t => t.Id === id)
    if (toolIndex === -1) {
      throw new Error('Tool not found')
    }
    
    this.tools[toolIndex] = {
      ...this.tools[toolIndex],
      ...data
    }
    
    return { ...this.tools[toolIndex] }
  }

  async delete(id) {
    await delay(300)
    const toolIndex = this.tools.findIndex(t => t.Id === id)
    if (toolIndex === -1) {
      throw new Error('Tool not found')
    }
    
    this.tools.splice(toolIndex, 1)
    return true
  }
}

export const toolService = new ToolService()