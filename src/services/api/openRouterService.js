import axios from 'axios'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class OpenRouterService {
  constructor() {
    this.baseURL = 'https://openrouter.ai/api/v1'
    this.defaultModel = 'anthropic/claude-3.5-sonnet'
  }

  async sendChatMessage(message, userRole = null, apiKey = null) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required')
    }

    await delay(200) // Simulate network delay

    const systemPrompt = this.getSystemPrompt(userRole)
    
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.defaultModel,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ProMind AI'
          }
        }
      )

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content
      } else {
        throw new Error('Invalid response format from OpenRouter API')
      }
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      
      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data
        
        if (status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key.')
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        } else if (status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter account balance.')
        } else {
          throw new Error(`OpenRouter API error: ${errorData?.error?.message || 'Unknown error'}`)
        }
      } else if (error.request) {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error('Failed to send message to OpenRouter API')
      }
    }
  }

  getSystemPrompt(userRole) {
    const rolePrompts = {
      doctor: `You are an AI assistant specialized in helping medical professionals. You provide informative, evidence-based responses while emphasizing that your advice is for informational purposes only and should not replace professional medical consultation. Always remind users to consult with qualified healthcare providers for medical decisions.`,
      
      engineer: `You are an AI assistant specialized in helping engineers and technical professionals. You provide detailed technical analysis, problem-solving approaches, and engineering insights. Focus on practical solutions, design considerations, safety standards, and best practices in engineering disciplines.`,
      
      developer: `You are an AI assistant specialized in helping software developers and programmers. You provide coding solutions, technical explanations, best practices, and debugging assistance. Focus on clean code, efficient algorithms, and modern development practices across various programming languages and frameworks.`,
      
      default: `You are ProMind AI, a helpful and knowledgeable AI assistant. You provide clear, accurate, and helpful responses to user questions. Be professional, friendly, and informative while adapting your communication style to the user's needs.`
    }

    return rolePrompts[userRole?.toLowerCase()] || rolePrompts.default
  }

  async testConnection(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required')
    }

    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      return response.status === 200
    } catch (error) {
      console.error('OpenRouter connection test failed:', error)
      return false
    }
  }
}

export const openRouterService = new OpenRouterService()