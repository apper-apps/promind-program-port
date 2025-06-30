import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const ToolCard = ({ tool, onSelect, userPlan = 'free' }) => {
  const isLocked = tool.requiresVIP && userPlan !== 'vip'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isLocked && onSelect(tool)}
      className={`relative bg-surface rounded-xl p-6 shadow-soft border border-gray-100 cursor-pointer transition-all duration-200 ${
        isLocked ? 'opacity-60' : 'hover:shadow-soft-lg'
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-orange-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <ApperIcon name="Lock" size={32} className="text-accent-600 mx-auto mb-2" />
            <Badge variant="vip" size="sm">VIP Only</Badge>
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isLocked ? 'bg-gray-100' : 'bg-gradient-to-r from-primary-100 to-secondary-100'
        }`}>
          <ApperIcon 
            name={tool.icon} 
            size={24} 
            className={isLocked ? 'text-gray-400' : 'text-primary-600'} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
          
          {tool.requiresVIP && (
            <div className="mt-3">
              <Badge variant="vip" size="sm">VIP Feature</Badge>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ToolCard