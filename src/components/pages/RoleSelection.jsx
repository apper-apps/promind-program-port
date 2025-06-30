import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import RoleCard from '@/components/molecules/RoleCard'
import Button from '@/components/atoms/Button'
import { roleService } from '@/services/api/roleService'
import { userService } from '@/services/api/userService'

const RoleSelection = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [saving, setSaving] = useState(false)

  const roles = roleService.getAvailableRoles()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleConfirmRole = async () => {
    if (!selectedRole) return

    setSaving(true)
    try {
      await userService.updateUserRole(selectedRole.name)
      toast.success(`Welcome, ${selectedRole.name}! Your role has been updated.`)
      navigate('/')
    } catch (error) {
      console.error('Failed to update role:', error)
      toast.error('Failed to update role. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Select Your Role" 
        subtitle="Choose your profession to get personalized tools"
      />
      
      <div className="p-4 space-y-6">
        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
        >
          <h2 className="text-lg font-bold mb-2">Personalize Your Experience</h2>
          <p className="text-white/80 text-sm">
            Select your profession to unlock role-specific tools and AI assistance tailored to your needs.
          </p>
        </motion.div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RoleCard
                role={role}
                onSelect={handleRoleSelect}
                isSelected={selectedRole?.name === role.name}
              />
            </motion.div>
          ))}
        </div>

        {/* Confirm Button */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-4 bg-surface rounded-xl p-4 shadow-float border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Selected Role</h3>
                <p className="text-sm text-gray-600">{selectedRole.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {selectedRole.name.charAt(0)}
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleConfirmRole}
              loading={saving}
              className="w-full"
            >
              Confirm Selection
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default RoleSelection