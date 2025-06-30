import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ToolCard from "@/components/molecules/ToolCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toolService } from "@/services/api/toolService";
import { userService } from "@/services/api/userService";

const Tools = () => {
  const navigate = useNavigate()
  const [tools, setTools] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [toolsData, userData] = await Promise.all([
        toolService.getAll(),
        userService.getCurrentUser()
      ])
      
      setTools(toolsData)
      setUser(userData)
    } catch (err) {
      setError('Failed to load tools. Please try again.')
      console.error('Error loading tools:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToolSelect = (tool) => {
    if (tool.requiresVIP && user?.plan !== 'vip') {
      toast.warning('This tool requires VIP access. Upgrade to unlock all features!')
      return
    }
    
    toast.success(`Opening ${tool.name}...`)
    // Here you would navigate to the specific tool or open a modal
  }

  const filteredTools = tools.filter(tool => 
    !user?.role || tool.roles.includes(user.role.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Tools" subtitle="Role-specific productivity tools" user={user} />
        <div className="p-4">
          <Loading variant="cards" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Tools" subtitle="Role-specific productivity tools" user={user} />
        <div className="p-4">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Tools" 
        subtitle={user?.role ? `${user.role} tools` : "Professional productivity tools"}
        user={user}
      />
      
      <div className="p-4">
        {user?.role && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-surface rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user.role.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user.role} Tools
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredTools.length} tools available for your role
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {filteredTools.length === 0 ? (
          <Empty
            title="No tools available"
            description={user?.role ? 
              `No tools found for ${user.role}. More tools coming soon!` : 
              "Select your role to see personalized tools"
            }
            icon="Wrench"
            actionLabel={!user?.role ? "Select Role" : undefined}
            onAction={!user?.role ? () => navigate('/role-selection') : undefined}
          />
        ) : (
          <div className="space-y-4">
            {filteredTools.map((tool, index) => (
<motion.div
                key={tool.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ToolCard
tool={{
                    ...tool,
                    name: tool.Name,
                    requiresVIP: tool.requires_vip
                  }}
                  onSelect={handleToolSelect}
                  userPlan={user?.plan || 'free'}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* VIP Upgrade Banner */}
        {user?.plan === 'free' && filteredTools.some(tool => tool.requiresVIP) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-accent-500 to-orange-500 rounded-xl p-6 text-white"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Unlock All Tools</h3>
              <p className="text-white/80 text-sm mb-4">
                Upgrade to VIP to access all premium tools and features
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white text-accent-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Upgrade to VIP
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Tools