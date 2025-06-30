import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI 
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          <ApperIcon name={isAI ? 'Bot' : 'User'} size={16} />
        </div>
        
        <div className={`rounded-2xl px-4 py-3 ${
          isAI 
            ? 'bg-surface border border-gray-200 text-gray-800' 
            : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
        }`}>
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${
            isAI ? 'text-gray-500' : 'text-white/70'
          }`}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage