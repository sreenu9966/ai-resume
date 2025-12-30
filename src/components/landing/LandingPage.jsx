import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { Benefits } from './Benefits';
import { ResumeModels } from './ResumeModels';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { AuthModal } from '../auth/AuthModal';
import { useNavigate } from 'react-router-dom';

export function LandingPage({ initialOpen = false }) {
    const [showAuthModal, setShowAuthModal] = useState(initialOpen);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <Navbar onOpenAuth={() => setShowAuthModal(true)} />
            <main>
                <Hero onOpenAuth={() => setShowAuthModal(true)} />
                <div className="relative">
                    {/* Decorative Separator */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    <Benefits />
                </div>
                <HowItWorks />
                <ResumeModels />
                <FAQ />
            </main>
            <Footer />
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => navigate('/builder')}
            />
        </div>
    );
}
