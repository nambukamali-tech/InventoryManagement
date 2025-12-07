import React, { useState } from "react";
import "../styles/Login.css";

function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:44318"; // backend URL

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!Email || !Password) {
      alert("Please enter both Email and Password.");
      return;
    }

    setLoading(true); // disable multiple clicks

    try {
      const res = await fetch(`${API_BASE}/User/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      if (data.success) {
        // Save user info
        localStorage.setItem("role", data.role);
        localStorage.setItem("fullName", data.fullName);

        alert(`Login successful! Welcome ${data.fullName}`);

        // Redirect based on role or page
        window.location.href = "/products";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          New user? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
