import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import { userService } from '@/services/api/userService'

const Dashboard = () => {
  const navigate = useNavigate()
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
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { 
      title: 'AI Assistant', 
      description: 'Chat with AI for quick help',
      icon: 'Bot', 
      path: '/chat',
      gradient: 'from-primary-500 to-secondary-500'
    },
    { 
      title: 'Tools', 
      description: 'Access role-specific tools',
      icon: 'Wrench', 
      path: '/tools',
      gradient: 'from-secondary-500 to-emerald-500'
    },
    { 
      title: 'Voice to Text', 
      description: 'Convert speech to text',
      icon: 'Mic', 
      path: '/voice',
      gradient: 'from-accent-500 to-orange-500'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Dashboard" />
        <div className="p-4">
          <Loading variant="cards" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="ProMind AI" 
        subtitle={user ? `Welcome back, ${user.name}` : "Welcome to ProMind AI"}
        user={user}
      />
      
      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-2">
                {user ? `Hello, ${user.name}!` : "Welcome to ProMind AI!"}
              </h2>
              <p className="text-white/80 text-sm">
                {user ? `Ready to boost your productivity as a ${user.role}?` : "Your AI-powered productivity assistant"}
              </p>
              {user?.role && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    <ApperIcon name="Briefcase" size={14} className="mr-1" />
                    {user.role}
                  </span>
                </div>
              )}
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Sparkles" size={32} />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-surface rounded-xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Tools Used</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Wrench" size={20} className="text-primary-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">AI Chats</p>
                </div>
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageCircle" size={20} className="text-secondary-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className="bg-surface rounded-xl p-4 shadow-soft border border-gray-100 cursor-pointer hover:shadow-soft-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-white`}>
                    <ApperIcon name={action.icon} size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Role Selection CTA */}
        {!user?.role && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface rounded-xl p-6 shadow-soft border border-gray-100"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="UserCheck" size={32} className="text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Role</h3>
              <p className="text-gray-600 mb-4">Choose your profession to get personalized tools and assistance</p>
              <Button onClick={() => navigate('/role-selection')}>
                Get Started
              </Button>
            </div>
          </motion.div>
        )}

        {/* VIP Upgrade */}
        {user?.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Upgrade to VIP</h3>
                <p className="text-white/80 text-sm mb-3">
                  Unlock all premium tools and features
                </p>
                <Button variant="secondary" size="sm">
                  Upgrade Now
                </Button>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Crown" size={32} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard