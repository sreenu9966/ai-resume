import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Auth({ onSuccess }) {
    const [mode, setMode] = useState("login"); // login | signup | forgot
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        identifier: ""
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear specific error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (mode === "signup") {
            if (!form.username.trim()) newErrors.username = "Username is required";
            else if (form.username.length < 3) newErrors.username = "Username must be at least 3 characters";

            if (!form.email.trim()) newErrors.email = "Email is required";
            else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

            if (!form.password) newErrors.password = "Password is required";
            else if (form.password.length < 6) newErrors.password = "Minimum 6 characters required";
        }

        if (mode === "login") {
            if (!form.identifier.trim()) newErrors.identifier = "Username or Email is required";
            if (!form.password) newErrors.password = "Password is required";
        }

        if (mode === "forgot") {
            if (!form.email.trim()) newErrors.email = "Email is required";
            else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // submit handler
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // SIGNUP
            if (mode === "signup") {
                await axios.post(`${API_URL}/auth/signup`, {
                    username: form.username,
                    email: form.email,
                    password: form.password
                });

                toast.success("Account created successfully!");
                setMode("login");
            }

            // LOGIN
            if (mode === "login") {
                const res = await axios.post(`${API_URL}/auth/login`, {
                    identifier: form.identifier,
                    password: form.password,
                });

                // Store token/user
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.removeItem('currentResumeId');

                toast.success("Login successful!");
                setShowSuccess(true);
            }

            // FORGOT USERNAME
            if (mode === "forgot") {
                const res = await axios.post(`${API_URL}/auth/forgot`, {
                    email: form.email
                });

                toast.success(`Your username is: ${res.data.username}`, { duration: 6000 });
                setMode("login");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            toast.error(msg);

            // Highlight specific backend errors if they match fields
            if (msg.toLowerCase().includes("username")) setErrors(prev => ({ ...prev, username: msg }));
            if (msg.toLowerCase().includes("email")) setErrors(prev => ({ ...prev, email: msg }));
        } finally {
            setIsLoading(false);
        }
    };

    // redirect to builder after success
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate('/builder');
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [showSuccess, navigate, onSuccess]);

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>
                        {mode === "login" && "Welcome Back"}
                        {mode === "signup" && "Create Account"}
                        {mode === "forgot" && "Find Username"}
                    </h2>
                    <p className="auth-subtitle">
                        {mode === "login" && "Enter your details to access your account"}
                        {mode === "signup" && "Join us to build your professional resume"}
                        {mode === "forgot" && "We'll help you recover your username"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* SIGNUP FORM */}
                    {mode === "signup" && (
                        <>
                            <div className="input-group">
                                <input
                                    name="username"
                                    className={errors.username ? "input-error" : ""}
                                    value={form.username}
                                    placeholder="Username"
                                    onChange={handleChange}
                                />
                                {errors.username && <span className="error-text">{errors.username}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="email"
                                    className={errors.email ? "input-error" : ""}
                                    value={form.email}
                                    placeholder="Email Address"
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="password"
                                    type="password"
                                    className={errors.password ? "input-error" : ""}
                                    value={form.password}
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>
                        </>
                    )}

                    {/* LOGIN FORM */}
                    {mode === "login" && (
                        <>
                            <div className="input-group">
                                <input
                                    name="identifier"
                                    className={errors.identifier ? "input-error" : ""}
                                    value={form.identifier}
                                    placeholder="Username or Email"
                                    onChange={handleChange}
                                />
                                {errors.identifier && <span className="error-text">{errors.identifier}</span>}
                            </div>
                            <div className="input-group">
                                <input
                                    name="password"
                                    type="password"
                                    className={errors.password ? "input-error" : ""}
                                    value={form.password}
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>
                        </>
                    )}

                    {/* FORGOT FORM */}
                    {mode === "forgot" && (
                        <div className="input-group">
                            <input
                                name="email"
                                className={errors.email ? "input-error" : ""}
                                value={form.email}
                                placeholder="Enter registered email"
                                onChange={handleChange}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                {mode === "login" && "Sign In"}
                                {mode === "signup" && "Create Account"}
                                {mode === "forgot" && "Send Username"}
                            </>
                        )}
                    </button>
                </form>

                {/* LINKS */}
                <div className="auth-footer">
                    {mode === "login" ? (
                        <>
                            <p>Don't have an account? <span onClick={() => { setMode("signup"); setErrors({}); }}>Sign Up</span></p>
                            <p className="forgot-link" onClick={() => { setMode("forgot"); setErrors({}); }}>Forgot username?</p>
                        </>
                    ) : (
                        <p>Already have an account? <span onClick={() => { setMode("login"); setErrors({}); }}>Sign In</span></p>
                    )}
                </div>
            </div>
        </div>
    );
}
