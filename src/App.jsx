import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import ScrollToTop from './components/ScrollToTop'
import VisionPage from './pages/VisionPage'
import ModelPage from './pages/ModelPage'
import SchemaPage from './pages/SchemaPage'
import RegulationPage from './pages/RegulationPage'
import GovernancePage from './pages/GovernancePage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<VisionPage />} />
        <Route path="/model" element={<ModelPage />} />
        <Route path="/how-it-works" element={<SchemaPage />} />
        <Route path="/regulation" element={<RegulationPage />} />
        <Route path="/governance" element={<GovernancePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
