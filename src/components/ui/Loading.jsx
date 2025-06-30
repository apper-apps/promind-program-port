import { motion } from 'framer-motion'

const Loading = ({ variant = 'default' }) => {
  if (variant === 'cards') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item * 0.1 }}
            className="bg-surface rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'chat') {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: item * 0.1 }}
            className={`flex ${item % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-xs rounded-2xl p-4 ${
              item % 2 === 0 
                ? 'bg-surface border border-gray-200' 
                : 'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-12"
    >
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </motion.div>
  )
}

export default Loading