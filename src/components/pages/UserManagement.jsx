import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { userService } from '@/services/api/userService'
import { useSelector } from 'react-redux'
import { roleService } from '@/services/api/roleService'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const roles = roleService.getAvailableRoles()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setError('')
      setLoading(true)
      const usersData = await userService.getAll()
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load users. Please try again.')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData) => {
    try {
      await userService.create(userData)
      toast.success('User created successfully!')
      setShowCreateModal(false)
      loadUsers()
    } catch (error) {
      console.error('Failed to create user:', error)
      toast.error('Failed to create user')
    }
  }

  const handleUpdateUser = async (id, userData) => {
    try {
      await userService.update(id, userData)
      toast.success('User updated successfully!')
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      await userService.delete(id)
      toast.success('User deleted successfully!')
      loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan
    
    return matchesSearch && matchesRole && matchesPlan
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="User Management" subtitle="Manage system users and permissions" />
        <div className="p-4">
          <Loading variant="cards" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="User Management" subtitle="Manage system users and permissions" />
        <div className="p-4">
          <Error message={error} onRetry={loadUsers} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="User Management" subtitle="Manage system users and permissions" />
      
      <div className="p-4 space-y-6">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4 shadow-soft space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
            <Button onClick={() => setShowCreateModal(true)} icon="Plus" size="sm">
              Add User
            </Button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.name} value={role.name}>{role.name}</option>
              ))}
            </select>
            
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        </motion.div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Empty
            title="No users found"
            description="No users match your current filters"
            icon="Users"
            actionLabel="Add First User"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
<motion.div
                key={user.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
<div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.Name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    
<div>
                      <h4 className="font-semibold text-gray-900">{user.Name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {user.role && (
                          <Badge variant="primary" size="sm">
                            {user.role}
                          </Badge>
)}
                        <Badge variant={user.plan === 'vip' ? 'vip' : 'default'} size="sm">
                          {user.plan === 'vip' ? 'VIP' : 'Free'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDeleteUser(user.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit User Modal would go here */}
      {(showCreateModal || editingUser) && (
        <UserModal
          user={editingUser}
          roles={roles}
          onSave={editingUser ? 
            (data) => handleUpdateUser(editingUser.Id, data) : 
            handleCreateUser
          }
          onClose={() => {
            setShowCreateModal(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}

const UserModal = ({ user, roles, onSave, onClose }) => {
const [formData, setFormData] = useState({
    name: user?.Name || '',
    email: user?.email || '',
    role: user?.role || '',
    plan: user?.plan || 'free'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {user ? 'Edit User' : 'Create User'}
          </h3>
          <Button variant="ghost" size="sm" icon="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.name} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="free">Free</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <Button type="submit" loading={saving} className="flex-1">
              {user ? 'Update User' : 'Create User'}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default UserManagement