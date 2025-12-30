import { useState } from "react";
import "./auth.css"

import axios from "../../api/axiosInstance";
import ForgotUser from "./ForgotUser";


export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/auth/login", { identifier, password });
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="auth-wrapper">
        <div className="auth-card">
      <h2>Login</h2>
      <input placeholder="Username or Email" onChange={e => setIdentifier(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <div className="auth-link">
        <span>Forgot UserName ?</span>
      </div>
      </div>
    </div>
  );
}
