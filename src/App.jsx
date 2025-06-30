import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Tools from '@/components/pages/Tools'
import AIChat from '@/components/pages/AIChat'
import Profile from '@/components/pages/Profile'
import RoleSelection from '@/components/pages/RoleSelection'
import VoiceToText from '@/components/pages/VoiceToText'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tools" element={<Tools />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="profile" element={<Profile />} />
            <Route path="role-selection" element={<RoleSelection />} />
            <Route path="voice" element={<VoiceToText />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </div>
    </Router>
  )
}

export default App