import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import { userService } from '@/services/api/userService'
import { useSelector } from 'react-redux'

const Profile = () => {
const navigate = useNavigate()
  const { user: authUser } = useSelector((state) => state.user)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

const handleApiKeyUpdate = async (newApiKey) => {
    try {
      await userService.updateOpenRouterApiKey(newApiKey)
      toast.success('API key updated successfully!')
      loadUserData() // Refresh user data
    } catch (error) {
      console.error('Failed to update API key:', error)
      toast.error('Failed to update API key')
    }
  }

  const profileSections = [
    // Admin Settings - only show for admin users
    ...(user?.role === 'admin' ? [{
      title: 'Admin Settings',
      items: [
        { 
          label: 'OpenRouter API Configuration', 
          icon: 'Settings', 
          action: () => {
            const newKey = prompt('Enter OpenRouter API Key:', user?.openRouterApiKey || '')
            if (newKey !== null) {
              handleApiKeyUpdate(newKey)
            }
          }
        }
      ]
    }] : []),
    {
      title: 'Account Settings',
      items: [
        { label: 'Change Role', icon: 'UserCheck', action: () => navigate('/role-selection') },
        { label: 'Notifications', icon: 'Bell', action: () => toast.info('Notifications settings coming soon!') },
        { label: 'Privacy & Security', icon: 'Shield', action: () => toast.info('Privacy settings coming soon!') }
      ]
    },
    {
      title: 'App Features',
      items: [
        { label: 'Voice to Text', icon: 'Mic', action: () => navigate('/voice') },
        { label: 'AI Assistant', icon: 'Bot', action: () => navigate('/chat') },
        { label: 'Tools', icon: 'Wrench', action: () => navigate('/tools') }
      ]
    },
    {
      title: 'Support & Info',
      items: [
        { label: 'Help Center', icon: 'HelpCircle', action: () => toast.info('Help center coming soon!') },
        { label: 'About ProMind AI', icon: 'Info', action: () => toast.info('About page coming soon!') },
        { label: 'Rate App', icon: 'Star', action: () => toast.success('Thank you for your feedback!') }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Profile" />
        <div className="p-4">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profile" subtitle="Manage your account and settings" user={user} />
      
      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
{user?.Name ? user.Name.charAt(0).toUpperCase() : authUser?.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
<h2 className="text-xl font-bold text-gray-900">
                {user?.Name || authUser?.firstName + ' ' + authUser?.lastName || 'User'}
              </h2>
              <p className="text-gray-600">{user?.email || authUser?.emailAddress || 'user@promind.ai'}</p>
              
              <div className="flex items-center space-x-3 mt-2">
                {user?.role && (
                  <Badge variant="primary" size="sm">
                    <ApperIcon name="Briefcase" size={12} className="mr-1" />
                    {user.role}
                  </Badge>
                )}
                <Badge variant={user?.plan === 'vip' ? 'vip' : 'default'} size="sm">
                  <ApperIcon name={user?.plan === 'vip' ? 'Crown' : 'User'} size={12} className="mr-1" />
                  {user?.plan === 'vip' ? 'VIP' : 'Free'}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* VIP Upgrade Banner */}
        {user?.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Upgrade to VIP</h3>
                <p className="text-white/80 text-sm mb-3">
Unlock all premium tools and features
                </p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/upgrade-vip')}>
                  <ApperIcon name="Crown" size={16} className="mr-2" />
                  Upgrade Now
                </Button>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Sparkles" size={32} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-900 px-2">{section.title}</h3>
            <div className="bg-surface rounded-xl shadow-soft overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.label}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name={item.icon} size={20} className="text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-900 px-2">Your Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl p-4 shadow-soft text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="MessageCircle" size={24} className="text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">AI Conversations</p>
            </div>
            
            <div className="bg-surface rounded-xl p-4 shadow-soft text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Wrench" size={24} className="text-secondary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-sm text-gray-600">Tools Used</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile