import { useState } from "react";
import axios from "../../api/axiosInstance";
import "./Auth.css";
export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSignup = async () => {
    await axios.post("/auth/signup", form);
    alert("Signup successful");
  };

  return (
    <div className="auth-wrapper">
        <div className="auth-card">
      <h2>Signup</h2>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleSignup}>Signup</button>

      <div className="auth-link">
        Already have an account? <span>Login</span>
      </div>
    </div>
    </div>
  );
}
