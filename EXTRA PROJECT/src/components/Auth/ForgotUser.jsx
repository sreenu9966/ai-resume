import { useState } from "react";
import "./Auth.css";
import axios from "../../api/axiosInstance";

export default function ForgotUser() {
  const [email, setEmail] = useState("");

  const findUser = async () => {
    try {
      const res = await axios.post("/auth/forgot", { email });
      alert("Username: " + res.data.username);
    } catch {
      alert("User not found");
    }
  };

  return (
    <div>
      <h2>Find Username</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={findUser}>Find</button>
    </div>
  );
}
