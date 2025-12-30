import React, { useRef } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider, useResume } from './context/ResumeContext';
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

function ResumeBuilder() {
  const resumeRef = useRef(null);
  const {
    resumeData, // Keep resumeData as it's used elsewhere
    showPaymentModal,
    setShowPaymentModal
  } = useResume();

  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [showOfferModal, setShowOfferModal] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Sync user data on mount
  React.useEffect(() => {
    const fetchUserStatus = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (token && user._id) {
        try {
          // We can use the existing GET /api/users profile or similar
          const res = await axios.get(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Failed to sync user status", err);
        }
      }
    };
    fetchUserStatus();

    // Show Offer Popup logic
    const timer = setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const hasSeenOffer = sessionStorage.getItem('hasSeenOffer');

      if (!user.isSubscribed && !hasSeenOffer && user.role !== 'guest') {
        setShowOfferModal(true);
        sessionStorage.setItem('hasSeenOffer', 'true');
      }
    }, 30000); // 30 seconds delay

    return () => clearTimeout(timer);
  }, []);
  // const { currentUser } = useAuth(); // Removed

  const handleDownloadClick = async () => {
    // Strict Guest Check - Block Preview/Export if Guest
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || token === 'guest-token' || user.role === 'guest') {
      setShowAuthModal(true);
      return;
    }

    // New: Check for subscription limit early
    const isSubscribed = user.isSubscribed;
    const downloadCount = user.downloadCount || 0;

    if (!isSubscribed && downloadCount >= 2) {
      setShowPaymentModal(true);
      return;
    }

    setIsGenerating(true);
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

  const [showAuthModal, setShowAuthModal] = React.useState(false); // State for AuthModal

  const handleFinalDownload = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || token === 'guest-token' || user.role === 'guest') {
      setShowAuthModal(true);
      return;
    }

    try {
      // Backend Check & Log
      const resumeId = localStorage.getItem('currentResumeId') || 'new-resume';
      const res = await axios.post(`${API_URL}/resumes/${resumeId}/download`, {
        userId: user._id || user.userId
      });

      // Update local storage count to stay in sync
      if (!user.isSubscribed) {
        const updatedUser = { ...user, downloadCount: (user.downloadCount || 0) + 1 };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // If successful, proceed with PDF generation
      const element = resumeRef.current;
      await generatePDF(element, 'save');
      setShowPreviewModal(false);

    } catch (error) {
      if (error.response?.status === 402) {
        setShowPreviewModal(false);
        setShowPaymentModal(true); // Open Subscription Modal from Context
      } else {
        console.error("Download error:", error);
        alert(error.response?.data?.message || "Failed to process download");
      }
    }
  };

  // Removed local showPaymentModal state

  return (
    <Layout onDownload={handleDownloadClick} isGenerating={isGenerating}>
      <div className="grid lg:grid-cols-2 gap-8 items-start h-[calc(100vh-8.5rem)]">
        <Editor />
        <Preview resumeRef={resumeRef} />
      </div>

      <PDFPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        pdfUrl={pdfUrl}
        onDownload={handleFinalDownload}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => { }}
      />

      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onApply={() => {
          setShowOfferModal(false);
          setShowPaymentModal(true);
        }}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </Layout>
  );
}

function App() {
  return (
    // <AuthProvider>
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page with Embedded Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage initialOpen={true} />} />

          <Route path="/builder" element={<ResumeBuilder />} />

          <Route path="/dashboard" element={
            <RequireAuth>
              <UserDashboard />
            </RequireAuth>
          } />

          {/* <Route path="/login" element={<Navigate to="/admin" replace />} /> */}



          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ResumeProvider>
    // </AuthProvider>
  );
}

export default App;
