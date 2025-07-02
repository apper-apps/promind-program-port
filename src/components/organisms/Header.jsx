import { motion } from 'framer-motion'
import { useContext } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { AuthContext } from '@/App'
const Header = ({ title, subtitle, showNotifications = true, user }) => {
  const authMethods = useContext(AuthContext)
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border-b border-gray-200 px-4 py-4"
    >
<div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              ProMind AI
            </h1>
            <p className="text-sm text-gray-600">Intelligent Assistant Platform</p>
          </div>
          {title && title !== 'ProMind AI' && (
            <div className="border-l border-gray-300 pl-4">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}
        </div>
        
<div className="flex items-center space-x-3">
          {user && (
            <div className="flex items-center space-x-2">
              <Badge variant={user.plan === 'vip' ? 'vip' : 'default'} size="sm">
                {user.plan === 'vip' ? '🌟 VIP' : 'Free'}
              </Badge>
            </div>
          )}
          
          {showNotifications && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ApperIcon name="Bell" size={20} />
            </motion.button>
          )}
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => authMethods.logout()}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ApperIcon name="LogOut" size={18} />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header