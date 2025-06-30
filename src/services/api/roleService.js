const availableRoles = [
  {
    name: 'Doctor',
    description: 'Medical professional with healthcare tools and AI assistance',
    icon: 'Stethoscope'
  },
  {
    name: 'Engineer',
    description: 'Technical professional with engineering tools and calculators',
    icon: 'Cog'
  },
  {
    name: 'Developer',
    description: 'Software developer with coding tools and documentation',
    icon: 'Code'
  },
  {
    name: 'Social Media Manager',
    description: 'Digital marketing professional with content creation tools',
    icon: 'Share2'
  },
  {
    name: 'Pharmacist',
    description: 'Pharmaceutical professional with drug information tools',
    icon: 'Pill'
  },
  {
    name: 'Teacher',
    description: 'Educational professional with lesson planning and grading tools',
    icon: 'GraduationCap'
  }
]

class RoleService {
  getAvailableRoles() {
    return availableRoles
  }

  getRoleByName(name) {
    return availableRoles.find(role => 
      role.name.toLowerCase() === name.toLowerCase()
    )
  }

  getRoleTools(roleName) {
    // This would integrate with toolService to get role-specific tools
    const roleToolMap = {
      'doctor': ['Drug Lookup', 'Voice Notes', 'AI Diagnosis', 'Patient Records'],
      'engineer': ['Unit Converter', 'Formula Solver', 'CAD Tools', 'Project Calculator'],
      'developer': ['Code Generator', 'StackOverflow Search', 'API Tester', 'Git Helper'],
      'social media manager': ['Content Planner', 'Hashtag Generator', 'Analytics Dashboard', 'Post Scheduler'],
      'pharmacist': ['Drug Interactions', 'Dosage Calculator', 'Inventory Manager', 'Prescription Checker'],
      'teacher': ['Lesson Planner', 'Grade Calculator', 'Quiz Generator', 'Attendance Tracker']
    }
    
    return roleToolMap[roleName.toLowerCase()] || []
  }
}

export const roleService = new RoleService()