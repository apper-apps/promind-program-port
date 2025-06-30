import { Outlet } from 'react-router-dom'
import BottomNavigation from '@/components/molecules/BottomNavigation'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default Layout