import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Campaigns from "./pages/Campaigns";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FundraiserDetails from "./pages/FundraiserDetails";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import { AuthProvider } from './context/AuthContext';
import FundraiserSetup from './pages/FundraiserSetup';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Donate from './pages/Donate';
import TestImageUpload from './components/TestImageUpload';

function App() {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/fundraiser/:id" element={<FundraiserDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route 
          path="/start-fundraiser" 
          element={
            <ProtectedRoute>
              <FundraiserSetup />
            </ProtectedRoute>
          } 
        />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-upload" element={<TestImageUpload />} />
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
