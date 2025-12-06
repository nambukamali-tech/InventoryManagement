import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductManage.css";

function ProductManage() {
  const role = localStorage.getItem("role"); // get logged-in user role

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Product Management</h2>
      <div className="row g-4">

        {/* Detergent Card */}
        <div className="col-md-4">
          <Link to="/detergent" className="card-link">
            <div className={`card text-center h-100 border-top border-4 border-danger`}>
              <div className="card-body">
                <h5 className="card-title">Detergent Items</h5>
                <p className="card-text">
                  {role === "Admin" 
                    ? "Manage all detergent products here with full access."
                    : "View all detergent products here."}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Liquid Card */}
        <div className="col-md-4">
          <Link to="/liquid" className="card-link">
            <div className={`card text-center h-100 border-top border-4 border-primary`}>
              <div className="card-body">
                <h5 className="card-title">Liquid Items</h5>
                <p className="card-text">
                  {role === "Admin" 
                    ? "Manage all liquid products here with full access."
                    : "View all liquid products here."}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Powder Card */}
        <div className="col-md-4">
          <Link to="/powder" className="card-link">
            <div className={`card text-center h-100 border-top border-4 border-success`}>
              <div className="card-body">
                <h5 className="card-title">Powder Items</h5>
                <p className="card-text">
                  {role === "Admin" 
                    ? "Manage all powder products here with full access."
                    : "View all powder products here."}
                </p>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ProductManage;
