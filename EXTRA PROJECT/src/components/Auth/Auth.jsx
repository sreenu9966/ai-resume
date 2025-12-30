import { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";


import "./Auth.css";
import Welcome from "../Welcome";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
    const [user, SetUser] = useState(null);
  const [form, setForm] = useState({

    username: "",
    email: "",
    password: "",
    identifier: ""
  });

  // input change handler
  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });
    
  };

  // submit handler
  const handleSubmit = async () => {
    try {
      // SIGNUP
      if (mode === "signup") {
        await axios.post("/auth/signup", {
          username: form.username,
          email: form.email,
          password: form.password
        });

        alert("Signup successful. Please login.");
        setMode("login");
      }

      // LOGIN
      if (mode === "login") {
       const res = await axios.post("/auth/login", {
          identifier: form.identifier,
          password: form.password,
        });
    
        SetUser(res.data.user)
        setShowSuccess(true);
    
      }

      // FORGOT USERNAME
      if (mode === "forgot") {
        const res = await axios.post("/auth/forgot", {
          email: form.email
        });

        alert("Your username is: " + res.data.username);
        setMode("login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // redirect to welcome after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setIsLoggedIn(true);
      }, 1);
      
      return () => clearTimeout(timer);
      
    }
  }, [showSuccess]);

  const handleLogout = () => {
  setIsLoggedIn(false);
};

  // once logged in → show welcome page
  if (isLoggedIn) {
    return <Welcome user={user}  onLogout={handleLogout} />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          {mode === "login" && "Login"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Find Username"}
        </h2>

        {/* SUCCESS MESSAGE */}
        {showSuccess && (
          <p style={{ color: "green", textAlign: "center", marginBottom: "10px" }}>
            ✅ Login successful! Redirecting to welcome page...
          </p>
        )}

        {/* SIGNUP FORM */}
        {mode === "signup" && (
          <>
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <>
            <input
              name="identifier"
              placeholder="Username or Email"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </>
        )}

        {/* FORGOT FORM */}
        {mode === "forgot" && (
          <input
            name="email"
            placeholder="Enter registered email"
            onChange={handleChange}
          />
        )}

        <button onClick={handleSubmit}>
          {mode === "login" && "Login"}
          {mode === "signup" && "Sign Up"}
          {mode === "forgot" && "Find"}
        </button>

        {/* LINKS */}
        <div className="auth-link">
          {mode !== "login" && (
            <span onClick={() => setMode("login")}>Login</span>
          )}
          {mode !== "signup" && (
            <span onClick={() => setMode("signup")}>Signup</span>
          )}
          {mode !== "forgot" && (
            <span onClick={() => setMode("forgot")}>Forgot?</span>
          )}
        </div>
      </div>
    </div>
  );
}
