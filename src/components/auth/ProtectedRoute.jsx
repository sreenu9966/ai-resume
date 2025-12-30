import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    // While loading, we might want to return a spinner or empty div instead of redirecting immediately
    // For now assuming currentUser is null if not authenticated after initial load
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    return children;
}
