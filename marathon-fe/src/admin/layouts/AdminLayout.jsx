import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminProtectedRoute from '../components/AdminProtectedRoute'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-obsidian">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
        <div
          className={`flex flex-1 flex-col min-w-0 transition-all duration-200 ${
            sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
          }`}
        >
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

export default AdminLayout
