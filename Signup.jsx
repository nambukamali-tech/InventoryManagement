import React from "react";
import Footer from "../components/Footer";
import "../styles/Signup.css";

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="text" placeholder="ID" required/>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="ConfirmPassword" required/>
          <button type="submit">Signup</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
