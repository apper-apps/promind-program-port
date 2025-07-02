import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { userService } from '@/services/api/userService'
import { useSelector } from 'react-redux'

const VipUpgrade = () => {
  const navigate = useNavigate()
  const { user: authUser } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)

  const handleStripeCheckout = () => {
    // Open Stripe checkout in new window
    const stripeCheckoutUrl = 'https://checkout.stripe.com/pay/your-stripe-payment-link-here'
    window.open(stripeCheckoutUrl, '_blank', 'width=800,height=600')
    
    toast.success('Payment window opened! Complete your purchase and then re-login to activate VIP features.')
  }

  const handleBackToProfile = () => {
    navigate('/profile')
  }

  const vipFeatures = [
    {
      icon: 'Zap',
      title: 'Unlimited AI Conversations',
      description: 'Chat with AI assistants without daily limits',
      free: 'Limited to 10/day',
      vip: 'Unlimited'
    },
    {
      icon: 'Crown',
      title: 'Premium Tools Access',
      description: 'Access all professional productivity tools',
      free: 'Basic tools only',
      vip: 'All premium tools'
    },
    {
      icon: 'Clock',
      title: 'Priority Processing',
      description: 'Faster response times and processing',
      free: 'Standard speed',
      vip: 'Priority processing'
    },
    {
      icon: 'Shield',
      title: 'Advanced Security',
      description: 'Enhanced data protection and privacy',
      free: 'Basic security',
      vip: 'Advanced security'
    },
    {
      icon: 'Headphones',
      title: 'Priority Support',
      description: '24/7 premium customer support',
      free: 'Community support',
      vip: '24/7 priority support'
    },
    {
      icon: 'Download',
      title: 'Export & Backup',
      description: 'Export conversations and data backups',
      free: 'Not available',
      vip: 'Full export capabilities'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Upgrade to VIP" 
        subtitle="Unlock the full potential of ProMind AI"
        showBack={true}
        onBack={handleBackToProfile}
      />
      
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-2xl p-8 text-white text-center"
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Crown" size={40} />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Become a VIP Member</h1>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Unlock unlimited AI conversations, premium tools, and priority support. 
            Transform your productivity with ProMind AI VIP.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={16} />
              <span>Unlimited Usage</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={16} />
              <span>Premium Tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={16} />
              <span>Priority Support</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-2xl p-8 shadow-soft text-center border-2 border-primary-200"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6">
            <ApperIcon name="Sparkles" size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">VIP Membership</h2>
          <div className="text-4xl font-bold text-gray-900 mb-1">$19.99</div>
          <p className="text-gray-600 mb-8">per month</p>
          
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleStripeCheckout}
            disabled={loading}
            className="w-full mb-4"
          >
            <ApperIcon name="CreditCard" size={20} className="mr-2" />
            {loading ? 'Processing...' : 'Upgrade Now with Stripe'}
          </Button>
          
          <p className="text-sm text-gray-500">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Compare Plans
          </h3>
          
          <div className="bg-surface rounded-2xl shadow-soft overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 p-4 font-semibold text-gray-900">
              <div>Features</div>
              <div className="text-center">Free Plan</div>
              <div className="text-center text-primary-600">VIP Plan</div>
            </div>
            
            {/* Feature Rows */}
            {vipFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="grid grid-cols-3 p-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={feature.icon} size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
                
                <div className="text-center text-gray-600 flex items-center justify-center">
                  {feature.free}
                </div>
                
                <div className="text-center text-primary-600 font-semibold flex items-center justify-center">
                  <ApperIcon name="Check" size={16} className="mr-1" />
                  {feature.vip}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Post-Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Info" size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">After Payment</h4>
              <div className="text-blue-800 space-y-2">
                <p>1. Complete your payment securely through Stripe</p>
                <p>2. Return to ProMind AI and log out</p>
                <p>3. Log back in to activate your VIP features</p>
                <p>4. Enjoy unlimited access to all premium tools!</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-gray-900 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-3">
            {[
              {
                question: "Can I cancel my VIP subscription anytime?",
                answer: "Yes, you can cancel your VIP subscription at any time. You'll continue to have VIP access until the end of your current billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment processor."
              },
              {
                question: "How long does it take to activate VIP features?",
                answer: "VIP features are activated immediately after payment. Simply log out and log back in to refresh your account status."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-surface rounded-xl p-4 shadow-soft">
                <h5 className="font-semibold text-gray-900 mb-2">{faq.question}</h5>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VipUpgrade