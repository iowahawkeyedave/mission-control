import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useIsMobile } from './lib/useIsMobile'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Workshop from './pages/Workshop'
import Costs from './pages/Costs'
import Cron from './pages/Cron'
import Scout from './pages/Scout'
import Docs from './pages/Docs'
import Agents from './pages/Agents'
import Settings from './pages/Settings'
import Skills from './pages/Skills'
import AWS from './pages/AWS'

export default function App() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen overflow-hidden macos-desktop">
      {/* Mobile hamburger button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        style={{
          display: 'none',
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 101,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          color: 'rgba(255, 255, 255, 0.9)',
          cursor: 'pointer'
        }}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <main className="flex-1 overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ padding: isMobile ? '16px' : '32px 40px' }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/workshop" element={<Workshop />} />
              <Route path="/costs" element={<Costs />} />
              <Route path="/cron" element={<Cron />} />
              <Route path="/scout" element={<Scout />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/aws" element={<AWS />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}