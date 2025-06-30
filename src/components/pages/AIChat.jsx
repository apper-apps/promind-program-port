import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ChatMessage from "@/components/molecules/ChatMessage";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { userService } from "@/services/api/userService";
import { chatService } from "@/services/api/chatService";
import { openRouterService } from "@/services/api/openRouterService";
const AIChat = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [chatHistory, userData] = await Promise.all([
        chatService.getChatHistory(),
        userService.getCurrentUser()
      ])
      
      setMessages(chatHistory)
      setUser(userData)
    } catch (error) {
      console.error('Failed to load chat data:', error)
      toast.error('Failed to load chat history')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const userMessage = {
      Id: Date.now(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      userId: user?.Id || 'anonymous'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setSending(true)

try {
      // Get user's API key
      const apiKey = await userService.getOpenRouterApiKey()
      let aiContent = ''

      if (apiKey) {
        try {
          // Use OpenRouter API
          aiContent = await openRouterService.sendChatMessage(
            userMessage.content,
            user?.role,
            apiKey
          )
        } catch (apiError) {
          console.error('OpenRouter API failed:', apiError)
          toast.error(apiError.message || 'AI service temporarily unavailable')
          // Fallback to mock response
          aiContent = generateAIResponse(userMessage.content, user?.role)
        }
      } else {
        // Use mock response when no API key is configured
        aiContent = generateAIResponse(userMessage.content, user?.role)
      }

      const aiResponse = {
        Id: Date.now() + 1,
        content: aiContent,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        userId: user?.Id || 'anonymous'
      }
      
      setMessages(prev => [...prev, aiResponse])
      setSending(false)
      
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again.')
      setSending(false)
    }
  }

  const generateAIResponse = (message, userRole) => {
    const responses = {
      doctor: [
        "As a medical professional, I'd be happy to help with your inquiry. However, please remember that this is for informational purposes only and doesn't replace professional medical advice.",
        "Based on your question, here are some general guidelines that might be helpful for healthcare professionals...",
        "In medical practice, it's important to consider multiple factors. Let me provide some insights that might be useful..."
      ],
      engineer: [
        "From an engineering perspective, this is an interesting problem. Let me break down the technical aspects...",
        "This requires careful consideration of the design parameters and constraints. Here's my analysis...",
        "In engineering, we need to consider efficiency, safety, and cost-effectiveness. Let me provide some technical insights..."
      ],
      developer: [
        "This is a great programming question! Let me help you with a solution approach...",
        "From a software development standpoint, there are several ways to tackle this problem...",
        "Here's how I would approach this coding challenge with best practices in mind..."
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="AI Assistant" subtitle="Chat with your AI companion" user={user} />
        <div className="p-4">
          <Loading variant="chat" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="AI Assistant" 
        subtitle={user?.role ? `${user.role} AI Assistant` : "Your AI companion"}
        user={user}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <Empty
              title="Start a conversation"
              description="Ask me anything! I'm here to help with your professional needs."
              icon="MessageCircle"
            />
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.Id} message={message} />
              ))}
              
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-start space-x-3 max-w-xs">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white">
                      <ApperIcon name="Bot" size={16} />
                    </div>
                    <div className="bg-surface border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-surface p-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="border-gray-200 focus:border-primary-500"
                />
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending}
                loading={sending}
                className="px-4 py-3"
              >
                <ApperIcon name="Send" size={18} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AIChat