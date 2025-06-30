const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    vip: "bg-gradient-to-r from-accent-500 to-orange-500 text-white",
    success: "bg-secondary-100 text-secondary-700",
    warning: "bg-accent-100 text-accent-700",
    danger: "bg-red-100 text-red-700"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm"
  }
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge