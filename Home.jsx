import React from "react";
import "../styles/Home.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h2>WELCOME TO JAY KAY SOAPS INVENTORY</h2>
      </header>
      <p className="home-paragraph">
        Manage JK Products Easily Like our Product EC Wash
      </p>
      <br/>
    
      <Link to="/products" className="inventory-btn">INVENTORY</Link>
      <Footer/>
    </div>
  );
}

export default Home;
