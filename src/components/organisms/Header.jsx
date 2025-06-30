import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const Header = ({ title, subtitle, showNotifications = true, user }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border-b border-gray-200 px-4 py-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <div className="flex items-center space-x-2">
              <Badge variant={user.plan === 'vip' ? 'vip' : 'default'} size="sm">
                {user.plan === 'vip' ? 'VIP' : 'Free'}
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
        </div>
      </div>
    </motion.header>
  )
}

export default Header