import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductPages.css";

function Detergent() {
  const navigate = useNavigate();

  const storedRole = localStorage.getItem("role") || "Employee";
  const role = storedRole.toLowerCase();
  const isAdmin = role === "admin";

  const [products, setProducts] = useState([]);//stores the fetched data
  const [newProduct, setNewProduct] = useState({
    ProductID: "",
    ProductName: "",
    ProductType: "Detergent",//Default type is detergent
    OpeningStock: 0,
    Production: 0,
    Dispatch: 0,
    ClosingStock: 0
  });

  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const API_BASE = "http://localhost:44318/Product";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/Get?ProductType=Detergent`);//call GET API
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();//send JSON Body
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();//When page loads fetch data
  }, []);

  // Add product
  const handleAdd = async () => {
    if (!newProduct.ProductID || !newProduct.ProductName)//check if product id and name is exists
   {
      alert("Product ID and Name are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)//send JSON body with newProduct datas
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setProducts(prev => [...prev, newProduct]);// If added successfully to table return message
        setNewProduct({
          ProductID: "",
          ProductName: "",
          ProductType: "Detergent",
          OpeningStock: 0,
          Production: 0,
          Dispatch: 0,
          ClosingStock: 0
        });
      }
    } catch (err) {
      console.error(err);
      alert("Server error while adding product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {//Delete product by id
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      const res = await fetch(`${API_BASE}/Delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) setProducts(products.filter(p => p.ProductID !== id));
    } catch (err) {
      console.error(err);
      alert("Server error while deleting product");
    }
  };

  // Edit modal
  const openEditModal = (product) => {
    setEditProduct({ ...product });
    setShowEditModal(true);//Modal is like the pop up window
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/Edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct)
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setProducts(products.map(p => (p.ProductID === editProduct.ProductID ? editProduct : p)));
        setShowEditModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while updating product");
    }
  };
//Use Html inside the Javascript
  return (
    <div className="product-page">
      <h2>Detergent Items</h2>
      <p>Manage all detergent products here.</p>

      {/* Add Product */}
      {isAdmin && (
        <div className="add-product">
          <input placeholder="Product ID" value={newProduct.ProductID} onChange={e => setNewProduct({ ...newProduct, ProductID: e.target.value })} />
          <input placeholder="Product Name" value={newProduct.ProductName} onChange={e => setNewProduct({ ...newProduct, ProductName: e.target.value })} />
          <input type="number" placeholder="Opening" value={newProduct.OpeningStock} onChange={e => setNewProduct({ ...newProduct, OpeningStock: parseInt(e.target.value) })} />
          <input type="number" placeholder="Production" value={newProduct.Production} onChange={e => setNewProduct({ ...newProduct, Production: parseInt(e.target.value) })} />
          <input type="number" placeholder="Dispatch" value={newProduct.Dispatch} onChange={e => setNewProduct({ ...newProduct, Dispatch: parseInt(e.target.value) })} />
          <input type="number" placeholder="Closing" value={newProduct.ClosingStock} onChange={e => setNewProduct({ ...newProduct, ClosingStock: parseInt(e.target.value) })} />
          <button onClick={handleAdd}>Add Product</button>
        </div>
      )}

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Opening Stock</th>
            <th>Production</th>
            <th>Dispatch</th>
            <th>Closing Stock</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.ProductID}>
              <td>{i + 1}</td>
              <td>{p.ProductID}</td>
              <td>{p.ProductName}</td>
              <td>{p.OpeningStock}</td>
              <td>{p.Production}</td>
              <td>{p.Dispatch}</td>
              <td>{p.ClosingStock}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => openEditModal(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.ProductID)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Product</h3>
             <input name="ProductID" placeholder="Product ID" value={editProduct.ProductID} onChange={handleEditChange} />
            <input name="ProductName" placeholder="Product Name" value={editProduct.ProductName} onChange={handleEditChange} />
            <input name="OpeningStock" type="number" placeholder="Opening" value={editProduct.OpeningStock} onChange={handleEditChange} />
            <input name="Production" type="number" placeholder="Production" value={editProduct.Production} onChange={handleEditChange} />
            <input name="Dispatch" type="number" placeholder="Dispatch" value={editProduct.Dispatch} onChange={handleEditChange} />
            <input name="ClosingStock" type="number" placeholder="Closing" value={editProduct.ClosingStock} onChange={handleEditChange} />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/products")}>← Back to Products</button>
    </div>
  );
}

export default Detergent;
