import React, { createContext, useEffect, useState } from "react";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "@/index.css";
import store from "@/store/index";
import { clearSelectedRole, clearUser, setSelectedRole, setUser } from "@/store/userSlice";
import Layout from "@/components/organisms/Layout";
import ErrorPage from "@/components/pages/ErrorPage";
import PromptPassword from "@/components/pages/PromptPassword";
import Signup from "@/components/pages/Signup";
import AIChat from "@/components/pages/AIChat";
import UserManagement from "@/components/pages/UserManagement";
import ExternalApis from "@/components/pages/ExternalApis";
import Tools from "@/components/pages/Tools";
import VipUpgrade from "@/components/pages/VipUpgrade";
import Home from "@/components/pages/Home";
import Dashboard from "@/components/pages/Dashboard";
import Login from "@/components/pages/Login";
import Callback from "@/components/pages/Callback";
import VoiceToText from "@/components/pages/VoiceToText";
import Profile from "@/components/pages/Profile";
import ResetPassword from "@/components/pages/ResetPassword";
import FreeTools from "@/components/pages/FreeTools";
import RoleSelection from "@/components/pages/RoleSelection";
import { userService } from "@/services/api/userService";

// Create auth context
export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: async function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
if (user) {
          // User is authenticated
          // Store user information in Redux first
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
          
          // Check if there's a selected role to update
          const storedRole = sessionStorage.getItem('selectedRole') || userState?.selectedRole;
          if (storedRole) {
            try {
              await userService.updateUserRole(storedRole);
              dispatch(clearSelectedRole());
            } catch (error) {
              console.error('Failed to update user role:', error);
            }
          }
          
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
? `/login?redirect=${currentPath}`
                : '/'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);// No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
<Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tools" element={<Tools />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="profile" element={<Profile />} />
            <Route path="role-selection" element={<RoleSelection />} />
<Route path="voice" element={<VoiceToText />} />
<Route path="users" element={<UserManagement />} />
            <Route path="external-apis" element={<ExternalApis />} />
            <Route path="upgrade-vip" element={<VipUpgrade />} />
            <Route path="free-tools" element={<FreeTools />} />
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
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

export default App