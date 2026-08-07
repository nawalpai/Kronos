import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/"    element={<Landing />} />
        <Route path="/app" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
