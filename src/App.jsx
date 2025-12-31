import React, { useRef } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Loader } from './components/ui/Loader';
import { Layout } from './components/layout/Layout';
import { Editor } from './components/editor/Editor';
import { Preview } from './components/preview/Preview';
import { generatePDF } from './utils/generatePDF';
import { PaymentModal } from './components/ui/PaymentModal';
// import { AdminDashboard } from './components/ui/AdminDashboard'; // Unused
import { PDFPreviewModal } from './components/ui/PDFPreviewModal';
import { OfferModal } from './components/ui/OfferModal';
import { LandingPage } from './components/landing/LandingPage';
import RequireAuth from './components/auth/RequireAuth';
import { AuthModal } from './components/auth/AuthModal'; // Import AuthModal
// import Auth from './components/auth/Auth'; // Embedded in Landing Page now

// import { generateMockUsers } from './services/adminService';
// import { AuthProvider, useAuth } from './context/AuthContext'; // Removed
import { UserDashboard } from './components/user/UserDashboard'; // Imported
// import { ProtectedRoute } from './components/auth/ProtectedRoute'; // Removed
// import { AdminRoute } from './components/auth/AdminRoute'; // Removed
import { API_URL } from './services/api';
import { Toaster } from 'react-hot-toast';

import { SEO } from './components/common/SEO';

function ResumeBuilder({ setShowAuthModal }) {
  const resumeRef = useRef(null);
  const { showPaymentModal, setShowPaymentModal, isGenerating, setIsGenerating } = useResume();

  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState(null);
  // Removed local isGenerating state

  const handleDownloadClick = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || token === 'guest-token' || user.role === 'guest') {
      setShowAuthModal(true);
      return;
    }

    const isSubscribed = user.isSubscribed;
    const downloadCount = user.downloadCount || 0;

    if (!isSubscribed && downloadCount >= 2) {
      setShowPaymentModal(true);
      return;
    }

    setIsGenerating(true);
    // Wait for state to propagate (render cycle) before capturing
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const element = resumeRef.current;
      const blob = await generatePDF(element, 'preview');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPreviewModal(true);
    } catch (err) {
      console.error("Preview failed", err);
      alert("Failed to generate preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalDownload = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || token === 'guest-token' || user.role === 'guest') {
      setShowAuthModal(true);
      return;
    }

    try {
      const resumeId = localStorage.getItem('currentResumeId') || 'new-resume';
      await axios.post(`${API_URL}/resumes/${resumeId}/download`, {
        userId: user._id || user.userId
      });

      if (!user.isSubscribed) {
        const updatedUser = { ...user, downloadCount: (user.downloadCount || 0) + 1 };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      const element = resumeRef.current;
      await generatePDF(element, 'save');
      setShowPreviewModal(false);

    } catch (error) {
      if (error.response?.status === 402) {
        setShowPreviewModal(false);
        setShowPaymentModal(true);
      } else {
        console.error("Download error:", error);
        alert(error.response?.data?.message || "Failed to process download");
      }
    }
  };

  return (
    <Layout onDownload={handleDownloadClick} isGenerating={isGenerating} fullHeight={true}>
      <SEO title="Editor" description="Edit your resume with real-time preview." />
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[30%_70%]">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
          <Editor />
        </div>
        <div className="min-w-0 overflow-x-auto lg:overflow-visible">
          <Preview resumeRef={resumeRef} isGenerating={isGenerating} />
        </div>
      </div>

      <PDFPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        pdfUrl={pdfUrl}
        onDownload={handleFinalDownload}
      />
    </Layout>
  );
}

function AppContent() {
  const { showPaymentModal, setShowPaymentModal } = useResume();
  const [showOfferModal, setShowOfferModal] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  // Sync user data and Offer logic
  React.useEffect(() => {
    const fetchUserStatus = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (token && user._id) {
        try {
          const res = await axios.get(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.data) localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to sync user status", err);
        }
      }
    };
    fetchUserStatus();

    // Offer Popup Logic (LIFTED)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const isGuest = !token || token === 'guest-token' || user.role === 'guest';

    if (user.isSubscribed) return;

    // Offer Popup Logic
    const showPopup = () => {
      if (!showPaymentModal && !showAuthModal) {
        setShowOfferModal(true);
      }
    };

    // Show immediately on every mount (refresh)
    showPopup();

    let interval;
    if (!isGuest) {
      // Recurring every 5 minutes for logged-in users only
      interval = setInterval(showPopup, 5 * 60 * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showPaymentModal, showAuthModal]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage initialOpen={true} />} />
        <Route path="/builder" element={<ResumeBuilder setShowAuthModal={setShowAuthModal} />} />
        <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onApply={() => {
          setShowOfferModal(false);
          setShowPaymentModal(true);
        }}
        onLogin={() => {
          setShowOfferModal(false);
          setShowAuthModal(true);
        }}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => { }}
      />
      <Toaster position="top-right" />
    </>
  );
}

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ResumeProvider>
          <AppContent />
        </ResumeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
