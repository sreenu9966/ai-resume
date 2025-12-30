import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Auth State from LocalStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else {
            // AUTH DISABLE MODE: Auto-login as Guest Admin
            setCurrentUser({
                uid: 'guest-admin',
                name: 'Guest Admin',
                email: 'admin@airesume.com',
                role: 'admin'
            });
        }
        setLoading(false);
    }, []);

    const signupWithEmail = async (email, password, name, mobile) => {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, mobile })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Save session
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.removeItem('currentResumeId');
            setCurrentUser(data.user);

            return data.user;
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save session
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.removeItem('currentResumeId');
            setCurrentUser(data.user);

            return data.user;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        throw new Error("Google Login is not implemented in this custom auth version yet.");
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        toast.success("Logged out successfully");
    };

    const value = {
        currentUser,
        loginWithGoogle,
        signupWithEmail,
        loginWithEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
