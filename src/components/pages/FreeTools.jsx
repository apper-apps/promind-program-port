import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { textSummaryService } from "@/services/api/textSummaryService";
import { textToolService } from "@/services/api/textToolService";
import { userService } from "@/services/api/userService";
import { openRouterService } from "@/services/api/openRouterService";
import { formatDistanceToNow } from "date-fns";

const FreeTools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Quick Notes state
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteFormData, setNoteFormData] = useState({
    name: '',
    content: '',
    text_tool: '',
    Tags: ''
  });

  // Summarizer state
  const [summaries, setSummaries] = useState([]);
  const [textTools, setTextTools] = useState([]);
  const [showSummarizerForm, setShowSummarizerForm] = useState(false);
  const [editingSummary, setEditingSummary] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(null);
  const [summarizerFormData, setSummarizerFormData] = useState({
    name: '',
    original_text: '',
    summarized_text: '',
    summarization_method: 'AI Assisted',
    text_tool: '',
    Tags: ''
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const [notesData, summariesData, textToolsData, userData] = await Promise.all([
        quickNoteService.getAll(),
        textSummaryService.getAll(),
        textToolService.getAll(),
        userService.getCurrentUser()
      ]);
      
      setNotes(notesData);
      setSummaries(summariesData);
      setTextTools(textToolsData);
      setUser(userData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading FreeTools data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick Notes handlers
  const handleCreateNote = () => {
    setEditingNote(null);
    setNoteFormData({
      name: '',
      content: '',
      text_tool: '',
      Tags: ''
    });
    setShowNoteForm(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteFormData({
      name: note.Name || '',
      content: note.content || '',
      text_tool: note.text_tool?.Id || '',
      Tags: note.Tags || ''
    });
    setShowNoteForm(true);
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingNote) {
        const updatedNote = await quickNoteService.update(editingNote.Id, noteFormData);
        if (updatedNote) {
          toast.success('Note updated successfully!');
          loadData();
          setShowNoteForm(false);
        }
      } else {
        const newNote = await quickNoteService.create({
          ...noteFormData,
          timestamp: new Date().toISOString()
        });
        if (newNote) {
          toast.success('Note created successfully!');
          loadData();
          setShowNoteForm(false);
        }
      }
    } catch (err) {
      toast.error('Failed to save note. Please try again.');
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      setLoading(true);
      const success = await quickNoteService.delete(noteId);
      if (success) {
        toast.success('Note deleted successfully!');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
    } finally {
      setLoading(false);
    }
  };

  // Summarizer handlers
  const handleCreateSummary = () => {
    setEditingSummary(null);
    setSummarizerFormData({
      name: '',
      original_text: '',
      summarized_text: '',
      summarization_method: 'AI Assisted',
      text_tool: '',
      Tags: ''
    });
    setShowSummarizerForm(true);
  };

  const handleEditSummary = (summary) => {
    setEditingSummary(summary);
    setSummarizerFormData({
      name: summary.Name || '',
      original_text: summary.original_text || '',
      summarized_text: summary.summarized_text || '',
      summarization_method: summary.summarization_method || 'AI Assisted',
      text_tool: summary.text_tool?.Id || '',
      Tags: summary.Tags || ''
    });
    setShowSummarizerForm(true);
  };

  const handleGenerateSummary = async () => {
    if (!summarizerFormData.original_text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    if (!user?.open_router_api_key) {
      toast.error('OpenRouter API key required. Please update your profile.');
      return;
    }

    try {
      setIsGeneratingSummary(true);
      
      const prompt = `Please provide a concise summary of the following text:\n\n${summarizerFormData.original_text}`;
      
      const aiSummary = await openRouterService.sendChatMessage(
        prompt,
        user.role,
        user.open_router_api_key
      );

      setSummarizerFormData(prev => ({
        ...prev,
        summarized_text: aiSummary,
        summarization_method: 'AI Assisted'
      }));

      toast.success('Summary generated successfully!');
    } catch (err) {
      toast.error('Failed to generate summary. Please try again.');
      console.error('Error generating summary:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSummarySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingSummary) {
        const updatedSummary = await textSummaryService.update(editingSummary.Id, summarizerFormData);
        if (updatedSummary) {
          toast.success('Summary updated successfully!');
          loadData();
          setShowSummarizerForm(false);
        }
      } else {
        const newSummary = await textSummaryService.create(summarizerFormData);
        if (newSummary) {
          toast.success('Summary created successfully!');
          loadData();
          setShowSummarizerForm(false);
        }
      }
    } catch (err) {
      toast.error('Failed to save summary. Please try again.');
      console.error('Error saving summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSummary = async (summaryId) => {
    if (!confirm('Are you sure you want to delete this summary?')) return;
    
    try {
      setLoading(true);
      const success = await textSummaryService.delete(summaryId);
      if (success) {
        toast.success('Summary deleted successfully!');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to delete summary. Please try again.');
      console.error('Error deleting summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandedSummary = (summaryId) => {
    setExpandedSummary(expandedSummary === summaryId ? null : summaryId);
  };

  const handleNoteInputChange = (e) => {
    const { name, value } = e.target;
    setNoteFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSummaryInputChange = (e) => {
    const { name, value } = e.target;
    setSummarizerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !showNoteForm && !showSummarizerForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Free Tools" subtitle="Quick notes and AI-powered text summarization" user={user} />
        <div className="p-4">
          <Loading variant="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Free Tools" subtitle="Quick notes and AI-powered text summarization" user={user} />
        <div className="p-4">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Free Tools" 
        subtitle="Quick notes and AI-powered text summarization"
        user={user}
      />
      
      <div className="p-4">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex bg-surface rounded-xl p-1 shadow-soft">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === 'notes'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="Edit" size={16} />
              <span className="font-medium">Quick Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('summarizer')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === 'summarizer'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="Book" size={16} />
              <span className="font-medium">Summarizer</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Create Note Button */}
              <div className="mb-6">
                <Button
                  onClick={handleCreateNote}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span>Create New Note</span>
                </Button>
              </div>

              {/* Note Form */}
              {showNoteForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-surface rounded-xl p-6 shadow-soft"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingNote ? 'Edit Note' : 'Create New Note'}
                  </h3>
                  
                  <form onSubmit={handleNoteSubmit} className="space-y-4">
                    <Input
                      label="Note Title"
                      name="name"
                      value={noteFormData.name}
                      onChange={handleNoteInputChange}
                      placeholder="Enter note title..."
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        name="content"
                        value={noteFormData.content}
                        onChange={handleNoteInputChange}
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
                        value={noteFormData.text_tool}
                        onChange={handleNoteInputChange}
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
                      value={noteFormData.Tags}
                      onChange={handleNoteInputChange}
                      placeholder="Enter tags separated by commas..."
                    />
                    
                    <div className="flex space-x-3">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => setShowNoteForm(false)}
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
            </motion.div>
          )}

          {activeTab === 'summarizer' && (
            <motion.div
              key="summarizer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Create Summary Button */}
              <div className="mb-6">
                <Button
                  onClick={handleCreateSummary}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  <span>Create New Summary</span>
                </Button>
              </div>

              {/* Summary Form */}
              {showSummarizerForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-surface rounded-xl p-6 shadow-soft"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {editingSummary ? 'Edit Summary' : 'Create New Summary'}
                  </h3>
                  
                  <form onSubmit={handleSummarySubmit} className="space-y-4">
                    <Input
                      label="Summary Title"
                      name="name"
                      value={summarizerFormData.name}
                      onChange={handleSummaryInputChange}
                      placeholder="Enter summary title..."
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Text
                      </label>
                      <textarea
                        name="original_text"
                        value={summarizerFormData.original_text}
                        onChange={handleSummaryInputChange}
                        placeholder="Paste the original text here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary || !summarizerFormData.original_text.trim()}
                        className="flex items-center space-x-2"
                      >
                        {isGeneratingSummary ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Sparkles" size={16} />
                            <span>Generate AI Summary</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Summarized Text
                      </label>
                      <textarea
                        name="summarized_text"
                        value={summarizerFormData.summarized_text}
                        onChange={handleSummaryInputChange}
                        placeholder="Enter the summarized version or use AI generation..."
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
                        value={summarizerFormData.summarization_method}
                        onChange={handleSummaryInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="AI Assisted">AI Assisted</option>
                        <option value="Manual">Manual</option>
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
                        value={summarizerFormData.text_tool}
                        onChange={handleSummaryInputChange}
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
                      value={summarizerFormData.Tags}
                      onChange={handleSummaryInputChange}
                      placeholder="Enter tags separated by commas..."
                    />
                    
                    <div className="flex space-x-3">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (editingSummary ? 'Update Summary' : 'Create Summary')}
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => setShowSummarizerForm(false)}
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
                            onClick={() => toggleExpandedSummary(summary.Id)}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FreeTools;