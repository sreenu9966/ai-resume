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
import { FeedbackButton } from '../common/FeedbackButton';

import { SEO } from '../common/SEO';

export function LandingPage({ initialOpen = false }) {
    const [showAuthModal, setShowAuthModal] = useState(initialOpen);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <SEO
                title="AI Powered Resume Builder"
                description="Create professional, ATS-friendly resumes in minutes. Our AI-powered builder helps you write the perfect resume to land your dream job."
                keywords="resume builder, free resume maker, cv builder, ai resume writer"
            />
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
            <FeedbackButton />
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => navigate('/builder')}
            />
        </div>
    );
}
