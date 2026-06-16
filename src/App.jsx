import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import GetInvolved from './pages/GetInvolved';
import Donate from './pages/Donate';
import Events from './pages/Events';
import EventRegister from './pages/EventRegister';
import ImpactStories from './pages/ImpactStories';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import DonationSuccess from './pages/DonationSuccess';
import DonationHistory from './pages/DonationHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import AiAssistant from './pages/AiAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LanguageThemeProvider } from './context/LanguageThemeContext';
import CancellationRefund from './pages/CancellationRefund';
import ShippingExchange from './pages/ShippingExchange';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <LanguageThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="programs" element={<Programs />} />
            
            {/* Protected Volunteer Route */}
            <Route path="get-involved" element={
              <ProtectedRoute>
                <GetInvolved />
              </ProtectedRoute>
            } />
            
            {/* Protected AI Assistant Route */}
            <Route path="ai-assistant" element={
              <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                <AiAssistant />
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Route */}
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="donate" element={<Donate />} />
            <Route path="donate-success" element={<DonationSuccess />} />
            <Route path="donation-history" element={<DonationHistory />} />
            <Route path="events" element={<Events />} />
            <Route path="events/register/:eventId" element={<EventRegister />} />
            <Route path="impact-stories" element={<ImpactStories />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cancellation-refund" element={<CancellationRefund />} />
            <Route path="shipping-exchange" element={<ShippingExchange />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  </LanguageThemeProvider>
  );
}

export default App;
