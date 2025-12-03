import React from "react";
import Footer from "../components/Footer";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
