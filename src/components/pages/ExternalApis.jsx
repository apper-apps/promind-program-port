import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import { externalApiService } from '@/services/api/externalApiService'
import { formatDateTime } from '@/utils/dateUtils'

const ExternalApis = () => {
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingApi, setEditingApi] = useState(null)
  const [selectedApis, setSelectedApis] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    api_name: '',
    model_name: '',
    authentication_details: '',
    access_control_settings: '',
    default_body: '',
    Tags: ''
  })

  useEffect(() => {
    loadApis()
  }, [])

  const loadApis = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await externalApiService.getAll()
      setApis(data)
    } catch (err) {
      setError(err.message)
      console.error('Error loading external APIs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingApi) {
        const updated = await externalApiService.update(editingApi.Id, formData)
        if (updated) {
          toast.success('External API updated successfully')
          await loadApis()
          handleCloseModal()
        }
      } else {
        const created = await externalApiService.create(formData)
        if (created) {
          toast.success('External API created successfully')
          await loadApis()
          handleCloseModal()
        }
      }
    } catch (error) {
      toast.error('Failed to save external API')
      console.error('Error saving external API:', error)
    }
  }

  const handleEdit = (api) => {
    setEditingApi(api)
    setFormData({
      name: api.Name || '',
      api_name: api.api_name || '',
      model_name: api.model_name || '',
      authentication_details: api.authentication_details || '',
      access_control_settings: api.access_control_settings || '',
      default_body: api.default_body || '',
      Tags: api.Tags || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (api) => {
    if (window.confirm(`Are you sure you want to delete "${api.Name}"?`)) {
      try {
        const success = await externalApiService.delete(api.Id)
        if (success) {
          toast.success('External API deleted successfully')
          await loadApis()
        }
      } catch (error) {
        toast.error('Failed to delete external API')
        console.error('Error deleting external API:', error)
      }
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedApis.length === 0) return
    
    if (window.confirm(`Are you sure you want to delete ${selectedApis.length} external API(s)?`)) {
      try {
        const success = await externalApiService.deleteMultiple(selectedApis)
        if (success) {
          toast.success(`${selectedApis.length} external API(s) deleted successfully`)
          setSelectedApis([])
          await loadApis()
        }
      } catch (error) {
        toast.error('Failed to delete selected external APIs')
        console.error('Error deleting external APIs:', error)
      }
    }
  }

  const handleTestConnection = async (api) => {
    try {
      const success = await externalApiService.testApiConnection(api)
      if (success) {
        toast.success(`Connection test successful for ${api.Name}`)
      }
    } catch (error) {
      toast.error(`Connection test failed for ${api.Name}`)
      console.error('Error testing connection:', error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingApi(null)
    setFormData({
      name: '',
      api_name: '',
      model_name: '',
      authentication_details: '',
      access_control_settings: '',
      default_body: '',
      Tags: ''
    })
  }

  const handleSelectApi = (apiId) => {
    setSelectedApis(prev => 
      prev.includes(apiId) 
        ? prev.filter(id => id !== apiId)
        : [...prev, apiId]
    )
  }

  const handleSelectAll = () => {
    if (selectedApis.length === filteredApis.length) {
      setSelectedApis([])
    } else {
      setSelectedApis(filteredApis.map(api => api.Id))
    }
  }

  const filteredApis = apis.filter(api =>
    api.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.api_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.model_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && apis.length === 0) return <Loading />
  if (error) return <Error message={error} onRetry={loadApis} />

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">External APIs</h1>
          <p className="text-gray-600">Manage your external API configurations</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add External API
        </Button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search external APIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {selectedApis.length > 0 && (
          <Button
            variant="danger"
            onClick={handleDeleteSelected}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Trash2" size={16} />
            Delete Selected ({selectedApis.length})
          </Button>
        )}
      </div>

      {/* APIs List */}
      {filteredApis.length === 0 ? (
        <Empty 
          title="No external APIs found"
          description="Get started by adding your first external API configuration"
          actionLabel="Add External API"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApis.length === filteredApis.length && filteredApis.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">API Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Model</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApis.map((api) => (
                  <motion.tr
                    key={api.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedApis.includes(api.Id)}
                        onChange={() => handleSelectApi(api.Id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Cloud" size={16} className="text-blue-500" />
                        <span className="font-medium text-gray-900">{api.Name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{api.api_name}</td>
                    <td className="px-4 py-3 text-gray-600">{api.model_name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {api.CreatedOn ? formatDateTime(api.CreatedOn) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTestConnection(api)}
                          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          title="Test Connection"
                        >
                          <ApperIcon name="Activity" size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(api)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <ApperIcon name="Edit" size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(api)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingApi ? 'Edit External API' : 'Add External API'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="External API Name"
                    />
                    <Input
                      label="API Name"
                      value={formData.api_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, api_name: e.target.value }))}
                      required
                      placeholder="API Provider Name"
                    />
                  </div>

                  <Input
                    label="Model Name"
                    value={formData.model_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, model_name: e.target.value }))}
                    required
                    placeholder="Model Identifier"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Authentication Details
                    </label>
                    <textarea
                      value={formData.authentication_details}
                      onChange={(e) => setFormData(prev => ({ ...prev, authentication_details: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="API key, token, or other authentication details"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Control Settings
                    </label>
                    <textarea
                      value={formData.access_control_settings}
                      onChange={(e) => setFormData(prev => ({ ...prev, access_control_settings: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Rate limits, permissions, and access controls"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Body
                    </label>
                    <textarea
                      value={formData.default_body}
                      onChange={(e) => setFormData(prev => ({ ...prev, default_body: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Default request body or configuration"
                    />
                  </div>

                  <Input
                    label="Tags"
                    value={formData.Tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, Tags: e.target.value }))}
                    placeholder="Comma-separated tags"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingApi ? 'Update' : 'Create'} External API
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExternalApis