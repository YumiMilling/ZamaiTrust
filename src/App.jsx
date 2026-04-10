import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AvocadoCase from './pages/AvocadoCase';
import AvocadoBatchDetail from './pages/AvocadoBatchDetail';
import PrinciplesPage from './pages/PrinciplesPage';
import ArchitecturePage from './pages/ArchitecturePage';
import EconomicsPage from './pages/EconomicsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/case/avocado"             element={<AvocadoCase />} />
          <Route path="/case/avocado/batch/:id"   element={<AvocadoBatchDetail />} />

          <Route path="/principles"   element={<PrinciplesPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/economics"    element={<EconomicsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
