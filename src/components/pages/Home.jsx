import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { setSelectedRole } from "@/store/userSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import RoleCard from "@/components/molecules/RoleCard";
import Loading from "@/components/ui/Loading";
import Login from "@/components/pages/Login";

// Role data based on tool table roles field
const roles = [
  {
    id: 'doctor',
    title: 'Doctor',
    description: 'Medical professional tools and AI assistance',
    icon: 'Stethoscope',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'pharmacist',
    title: 'Pharmacist',
    description: 'Pharmacy management and drug information',
    icon: 'Pill',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'developer',
    title: 'Developer',
    description: 'Coding tools and development assistance',
    icon: 'Code',
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    id: 'engineer',
    title: 'Engineer',
    description: 'Engineering tools and technical solutions',
    icon: 'Cog',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'social media manager',
    title: 'Social Media Manager',
    description: 'Content creation and social media tools',
    icon: 'Share2',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Educational tools and learning assistance',
    icon: 'GraduationCap',
    gradient: 'from-indigo-500 to-blue-500'
  }
];

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const [selectedRoleLocal, setSelectedRoleLocal] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleRoleSelect = (roleId) => {
    if (loading) return;
    
    setSelectedRoleLocal(roleId);
    setLoading(true);

    try {
      // Store the selected role temporarily in Redux and sessionStorage
      dispatch(setSelectedRole(roleId));
      
      const selectedRoleData = roles.find(r => r.id === roleId);
      toast.success(`Role selected: ${selectedRoleData?.title}`);
      
      // Redirect to login after successful role selection
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-bold">P</span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ProMind AI
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
            Empowering professionals with intelligent AI tools designed to boost productivity and streamline your workflow
          </p>
          
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Choose your profession to get personalized AI tools and assistance tailored to your needs
          </p>
        </motion.div>

        {/* Role Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12"
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
className="cursor-pointer"
              onClick={() => handleRoleSelect(role.id)}
            >
              <RoleCard
                role={role}
                onSelect={() => handleRoleSelect(role.id)}
                isSelected={selectedRoleLocal === role.id}
              />
            </motion.div>
          ))}
        </motion.div>

{/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedRoleLocal ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={() => selectedRoleLocal && handleRoleSelect(selectedRoleLocal)}
            disabled={!selectedRoleLocal || loading}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Setting Role...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continue to Login
                <ApperIcon name="ArrowRight" size={16} />
              </div>
            )}
          </Button>
        </motion.div>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate('/login')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm underline transition-colors duration-200"
          >
            Skip role selection for now
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;