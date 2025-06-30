import { mockRecordings } from '@/services/mockData/recordings.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class VoiceService {
  constructor() {
    this.recordings = [...mockRecordings]
  }

  async getRecordings(userId = null) {
    await delay(300)
    if (userId) {
      return this.recordings
        .filter(rec => rec.userId === userId)
        .map(rec => ({ ...rec }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
    
    return this.recordings
      .map(rec => ({ ...rec }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async saveRecording(data) {
    await delay(400)
    const newRecording = {
      Id: Math.max(...this.recordings.map(r => r.Id)) + 1,
      ...data,
      timestamp: new Date().toISOString()
    }
    
    this.recordings.unshift(newRecording)
    return { ...newRecording }
  }

  async getById(id) {
    await delay(250)
    const recording = this.recordings.find(r => r.Id === id)
    if (!recording) {
      throw new Error('Recording not found')
    }
    return { ...recording }
  }

  async create(data) {
    await delay(400)
    const newRecording = {
      Id: Math.max(...this.recordings.map(r => r.Id)) + 1,
      ...data,
      timestamp: new Date().toISOString()
    }
    
    this.recordings.push(newRecording)
    return { ...newRecording }
  }

  async update(id, data) {
    await delay(400)
    const recordingIndex = this.recordings.findIndex(r => r.Id === id)
    if (recordingIndex === -1) {
      throw new Error('Recording not found')
    }
    
    this.recordings[recordingIndex] = {
      ...this.recordings[recordingIndex],
      ...data
    }
    
    return { ...this.recordings[recordingIndex] }
  }

  async delete(id) {
    await delay(300)
    const recordingIndex = this.recordings.findIndex(r => r.Id === id)
    if (recordingIndex === -1) {
      throw new Error('Recording not found')
    }
    
    this.recordings.splice(recordingIndex, 1)
    return true
  }
}

export const voiceService = new VoiceService()