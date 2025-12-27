import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Businesses from './pages/Businesses'
import PremiumBusinesses from './pages/PremiumBusinesses'
import MapPage from './pages/Map'
import BusinessDetail from './pages/BusinessDetail'
import SubmitBusiness from './pages/SubmitBusiness'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="businesses" element={<Businesses />} />
          <Route path="premium" element={<PremiumBusinesses />} />
          <Route path="map" element={<MapPage />} />
          <Route path="business/:id" element={<BusinessDetail />} />
          <Route path="submit" element={<SubmitBusiness />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
