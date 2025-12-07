import React, { useState } from "react";
import "../styles/Signup.css";

function Signup() {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Role, setRole] = useState("Employee"); // default value

  const API_BASE = "http://localhost:44318";

  const handleSignup = async (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!FullName || !Email || !Password || !Role) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/User/Signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FullName, Email, Password, Role })
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("Employee");
      }

    } catch (err) {
      console.error(err);
      alert("Server error. Make sure backend is running on http://localhost:44318");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full Name"
            value={FullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Role Dropdown */}
          <select
            value={Role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>

          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
