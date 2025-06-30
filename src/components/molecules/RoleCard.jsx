import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const RoleCard = ({ role, onSelect, isSelected = false }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(role)}
      className={`bg-surface rounded-xl p-6 shadow-soft border-2 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-100 hover:border-primary-200 hover:shadow-soft-lg'
      }`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${
          isSelected 
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
            : 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-600'
        }`}>
          <ApperIcon name={role.icon} size={32} />
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{role.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{role.description}</p>
      </div>
    </motion.div>
  )
}

export default RoleCard