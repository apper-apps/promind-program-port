import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = () => {
const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/free-tools', icon: 'FileText', label: 'FreeTools' },
    { path: '/chat', icon: 'MessageCircle', label: 'Chat' },
    { path: '/profile', icon: 'User', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="mb-1"
            >
              <ApperIcon name={item.icon} size={20} />
            </motion.div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;