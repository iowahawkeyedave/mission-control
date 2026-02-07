import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Workshop from './pages/Workshop'
import Costs from './pages/Costs'
import Cron from './pages/Cron'
import Scout from './pages/Scout'
import Docs from './pages/Docs'
import Agents from './pages/Agents'

function LiquidGlassFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        {/* Refraction / goo effect */}
        <filter id="liquid-refraction">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        {/* Subtle glass warp */}
        <filter id="glass-warp">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden gradient-mesh-bg">
      <LiquidGlassFilters />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/cron" element={<Cron />} />
            <Route path="/scout" element={<Scout />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/agents" element={<Agents />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}
