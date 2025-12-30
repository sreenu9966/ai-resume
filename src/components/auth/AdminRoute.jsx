import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    // if (currentUser.role !== 'admin') {
    //     // If logged in but not admin, redirect to user dashboard
    //     // We could also show a "Forbidden" page
    //     // return <Navigate to="/dashboard" replace />;
    // }

    return children;
}
