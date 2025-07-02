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
import { quickNoteService } from "@/services/api/quickNoteService";
import { textToolService } from "@/services/api/textToolService";
import { userService } from "@/services/api/userService";
import { formatDistanceToNow } from "date-fns";

const QuickNotes = () => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [textTools, setTextTools] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
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
      
      const [notesData, textToolsData, userData] = await Promise.all([
        quickNoteService.getAll(),
        textToolService.getAll(),
        userService.getCurrentUser()
      ])
      
      setNotes(notesData)
      setTextTools(textToolsData)
      setUser(userData)
    } catch (err) {
      setError('Failed to load quick notes. Please try again.')
      console.error('Error loading quick notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setFormData({
      name: '',
      content: '',
      text_tool: '',
      Tags: ''
    })
    setShowCreateForm(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setFormData({
      name: note.Name || '',
      content: note.content || '',
      text_tool: note.text_tool?.Id || '',
      Tags: note.Tags || ''
    })
    setShowCreateForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      if (editingNote) {
        const updatedNote = await quickNoteService.update(editingNote.Id, formData)
        if (updatedNote) {
          toast.success('Note updated successfully!')
          loadData()
          setShowCreateForm(false)
        }
      } else {
        const newNote = await quickNoteService.create({
          ...formData,
          timestamp: new Date().toISOString()
        })
        if (newNote) {
          toast.success('Note created successfully!')
          loadData()
          setShowCreateForm(false)
        }
      }
    } catch (err) {
      toast.error('Failed to save note. Please try again.')
      console.error('Error saving note:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      setLoading(true)
      const success = await quickNoteService.delete(noteId)
      if (success) {
        toast.success('Note deleted successfully!')
        loadData()
      }
    } catch (err) {
      toast.error('Failed to delete note. Please try again.')
      console.error('Error deleting note:', err)
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

  if (loading && !showCreateForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Quick Notes" subtitle="Capture your thoughts instantly" user={user} />
        <div className="p-4">
          <Loading variant="cards" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Quick Notes" subtitle="Capture your thoughts instantly" user={user} />
        <div className="p-4">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Quick Notes" 
        subtitle="Capture your thoughts instantly"
        user={user}
      />
      
      <div className="p-4">
        {/* Create Button */}
        <div className="mb-6">
          <Button
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Create New Note</span>
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
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Note Title"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter note title..."
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your note content..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
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
                  {loading ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
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

        {/* Notes List */}
        {notes.length === 0 ? (
          <Empty
            title="No notes yet"
            description="Create your first quick note to get started"
            icon="Edit"
            actionLabel="Create Note"
            onAction={handleCreateNote}
          />
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <motion.div
                key={note.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {note.Name || 'Untitled Note'}
                    </h3>
                    {note.text_tool && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <ApperIcon name="FileText" size={14} />
                        <span>{note.text_tool.Name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.Id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {note.timestamp ? formatDistanceToNow(new Date(note.timestamp), { addSuffix: true }) : 'No date'}
                  </span>
                  {note.Tags && (
                    <div className="flex flex-wrap gap-1">
                      {note.Tags.split(',').map((tag, idx) => (
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

export default QuickNotes