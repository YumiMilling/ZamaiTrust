import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import ScrollToTop from './components/ScrollToTop'
import VisionPage from './pages/VisionPage'
import SystemPage from './pages/SystemPage'
import ParticipantsPage from './pages/ParticipantsPage'
import GovernancePage from './pages/GovernancePage'
import ModelPage from './pages/ModelPage'
import PlanPage from './pages/PlanPage'
import RegulationPage from './pages/RegulationPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<VisionPage />} />
        <Route path="/system" element={<SystemPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/model" element={<ModelPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/regulation" element={<RegulationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
