export default function Profile({user, onLogout }) {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>👤 Profile Dashboard</h2>

      <div style={cardStyle}>
        <p><b>Username:{user.username}</b></p>
        <p><b>Email:</b>{user.email}</p>
        <p><b>Role:</b> User</p>
      </div>

      <button style={logoutBtn} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

const cardStyle = {
  margin: "20px auto",
  width: "300px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px"
};

const logoutBtn = {
  padding: "10px 20px",
  background: "#e63946",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
