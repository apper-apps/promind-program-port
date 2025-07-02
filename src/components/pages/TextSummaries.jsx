import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { textSummaryService } from "@/services/api/textSummaryService";
import { textToolService } from "@/services/api/textToolService";
import { userService } from "@/services/api/userService";
import { formatDistanceToNow } from "date-fns";

const TextSummaries = () => {
  const navigate = useNavigate()
  const [summaries, setSummaries] = useState([])
  const [textTools, setTextTools] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSummary, setEditingSummary] = useState(null)
  const [expandedSummary, setExpandedSummary] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    original_text: '',
    summarized_text: '',
    summarization_method: 'Manual',
    text_tool: '',
    Tags: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [summariesData, textToolsData, userData] = await Promise.all([
        textSummaryService.getAll(),
        textToolService.getAll(),
        userService.getCurrentUser()
      ])
      
      setSummaries(summariesData)
      setTextTools(textToolsData)
      setUser(userData)
    } catch (err) {
      setError('Failed to load text summaries. Please try again.')
      console.error('Error loading text summaries:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSummary = () => {
    setEditingSummary(null)
    setFormData({
      name: '',
      original_text: '',
      summarized_text: '',
      summarization_method: 'Manual',
      text_tool: '',
      Tags: ''
    })
    setShowCreateForm(true)
  }

  const handleEditSummary = (summary) => {
    setEditingSummary(summary)
    setFormData({
      name: summary.Name || '',
      original_text: summary.original_text || '',
      summarized_text: summary.summarized_text || '',
      summarization_method: summary.summarization_method || 'Manual',
      text_tool: summary.text_tool?.Id || '',
      Tags: summary.Tags || ''
    })
    setShowCreateForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      if (editingSummary) {
        const updatedSummary = await textSummaryService.update(editingSummary.Id, formData)
        if (updatedSummary) {
          toast.success('Summary updated successfully!')
          loadData()
          setShowCreateForm(false)
        }
      } else {
        const newSummary = await textSummaryService.create(formData)
        if (newSummary) {
          toast.success('Summary created successfully!')
          loadData()
          setShowCreateForm(false)
        }
      }
    } catch (err) {
      toast.error('Failed to save summary. Please try again.')
      console.error('Error saving summary:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSummary = async (summaryId) => {
    if (!confirm('Are you sure you want to delete this summary?')) return
    
    try {
      setLoading(true)
      const success = await textSummaryService.delete(summaryId)
      if (success) {
        toast.success('Summary deleted successfully!')
        loadData()
      }
    } catch (err) {
      toast.error('Failed to delete summary. Please try again.')
      console.error('Error deleting summary:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleExpanded = (summaryId) => {
    setExpandedSummary(expandedSummary === summaryId ? null : summaryId)
  }

  if (loading && !showCreateForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Text Summaries" subtitle="Organize and manage your text summaries" user={user} />
        <div className="p-4">
          <Loading variant="cards" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Text Summaries" subtitle="Organize and manage your text summaries" user={user} />
        <div className="p-4">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Text Summaries" 
        subtitle="Organize and manage your text summaries"
        user={user}
      />
      
      <div className="p-4">
        {/* Create Button */}
        <div className="mb-6">
          <Button
            onClick={handleCreateSummary}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Create New Summary</span>
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-surface rounded-xl p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingSummary ? 'Edit Summary' : 'Create New Summary'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Summary Title"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter summary title..."
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Text
                </label>
                <textarea
                  name="original_text"
                  value={formData.original_text}
                  onChange={handleInputChange}
                  placeholder="Paste the original text here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summarized Text
                </label>
                <textarea
                  name="summarized_text"
                  value={formData.summarized_text}
                  onChange={handleInputChange}
                  placeholder="Enter the summarized version..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summarization Method
                </label>
                <select
                  name="summarization_method"
                  value={formData.summarization_method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Manual">Manual</option>
                  <option value="AI Assisted">AI Assisted</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Extractive">Extractive</option>
                  <option value="Abstractive">Abstractive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Tool (Optional)
                </label>
                <select
                  name="text_tool"
                  value={formData.text_tool}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a text tool...</option>
                  {textTools.map(tool => (
                    <option key={tool.Id} value={tool.Id}>
                      {tool.Name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas..."
              />
              
              <div className="flex space-x-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingSummary ? 'Update Summary' : 'Create Summary')}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Summaries List */}
        {summaries.length === 0 ? (
          <Empty
            title="No summaries yet"
            description="Create your first text summary to get started"
            icon="Book"
            actionLabel="Create Summary"
            onAction={handleCreateSummary}
          />
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <motion.div
                key={summary.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {summary.Name || 'Untitled Summary'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="BookOpen" size={14} />
                        <span>{summary.summarization_method}</span>
                      </span>
                      {summary.text_tool && (
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="FileText" size={14} />
                          <span>{summary.text_tool.Name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleExpanded(summary.Id)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon 
                        name={expandedSummary === summary.Id ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                    </button>
                    <button
                      onClick={() => handleEditSummary(summary)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSummary(summary.Id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Summary:</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {summary.summarized_text}
                    </p>
                  </div>
                  
                  {expandedSummary === summary.Id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t pt-3"
                    >
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Original Text:</h4>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        {summary.original_text}
                      </p>
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
                  <span>
                    {summary.CreatedOn ? formatDistanceToNow(new Date(summary.CreatedOn), { addSuffix: true }) : 'No date'}
                  </span>
                  {summary.Tags && (
                    <div className="flex flex-wrap gap-1">
                      {summary.Tags.split(',').map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TextSummaries