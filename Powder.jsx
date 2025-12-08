import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductPages.css";

function Powder() {
  const navigate = useNavigate();

  const storedRole = localStorage.getItem("role") || "Employee";
  const role = storedRole.toLowerCase();
  const isAdmin = role === "admin";

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ProductID: "",
    ProductName: "",
    ProductType: "Powder",
    OpeningStock: 0,
    Production: 0,
    Dispatch: 0,
    ClosingStock: 0
  });
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const API_BASE = "http://localhost:44318/Product";

  //Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/Get?ProductType=Powder`);
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); alert("Failed to fetch products"); }
  };

  useEffect(() => { fetchProducts(); }, []);

  //Add Products
  const handleAdd = async () => {
    if (!newProduct.ProductID || !newProduct.ProductName) {
      alert("Product ID and Name are required"); return;
    }
    try {
      const res = await fetch(`${API_BASE}/Add`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProduct)
      });
      const data = await res.json(); alert(data.message);
      if (data.success) setProducts(prev => [...prev, newProduct]);
      setNewProduct({ ...newProduct, ProductID:"", ProductName:"", OpeningStock:0, Production:0, Dispatch:0, ClosingStock:0 });
    } catch (err) { console.error(err); alert("Server error while adding product"); }
  };

//Delete Products
  const handleDelete = async (id) => { if (!window.confirm("Are you sure?")) return;
    try
     { const res = await fetch(`${API_BASE}/Delete`, 
      { 
        method:"POST", 
        headers:{"Content-Type":"application/json"}, 
        body:JSON.stringify({id})});
      const data = await res.json(); alert(data.message);
      if(data.success) setProducts(products.filter(p => p.ProductID!==id));
    }
     catch(err){ console.error(err); alert("Server error while deleting");      
     }
  };

//Edit Products
  const openEditModal = (product) => 
    { 
        setEditProduct({...product}); 
        setShowEditModal(true);
    };
  const handleEditChange = (e) => { const {name,value} = e.target; 
        setEditProduct(prev=>({...prev,[name]:value})); 
      };
  const handleUpdate = async () => { try{ const res = await fetch(`${API_BASE}/Edit`,
     {
       method:"POST",
       headers:{"Content-Type":"application/json"}, 
       body:JSON.stringify(editProduct)});
    const data = await res.json();
    alert(data.message);
    if(data.success)
      { 
        setProducts(products.map(p=>p.ProductID===editProduct.ProductID?editProduct:p)); 
        setShowEditModal(false); }
  } 
  catch(err){ console.error(err);
  alert("Server error while updating"); 
} 
};

  return (
    <div className="product-page">
      <h2>Powder Products</h2>
      <p>Manage all powder products here.</p>

      {isAdmin && (
        <div className="add-product">
          <input placeholder="Product ID" value={newProduct.ProductID} onChange={e=>setNewProduct({...newProduct, ProductID:e.target.value})}/>
          <input placeholder="Product Name" value={newProduct.ProductName} onChange={e=>setNewProduct({...newProduct, ProductName:e.target.value})}/>
          <input type="number" placeholder="Opening Stock" value={newProduct.OpeningStock} onChange={e=>setNewProduct({...newProduct, OpeningStock:parseInt(e.target.value)})}/>
          <input type="number" placeholder="Production" value={newProduct.Production} onChange={e=>setNewProduct({...newProduct, Production:parseInt(e.target.value)})}/>
          <input type="number" placeholder="Dispatch" value={newProduct.Dispatch} onChange={e=>setNewProduct({...newProduct, Dispatch:parseInt(e.target.value)})}/>
          <input type="number" placeholder="Closing Stock" value={newProduct.ClosingStock} onChange={e=>setNewProduct({...newProduct, ClosingStock:parseInt(e.target.value)})}/>
          <button onClick={handleAdd}>Add Product</button>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
          <th>S.No</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Opening Stock</th>
          <th>Production</th>
          <th>Dispatch</th>
          <th>Closing Stock</th>{isAdmin && <th>Actions</th>}</tr></thead>
        <tbody>{products.map((p,i)=><tr key={p.ProductID}><td>{i+1}</td><td>{p.ProductID}</td><td>{p.ProductName}</td><td>{p.OpeningStock}</td><td>{p.Production}</td><td>{p.Dispatch}</td><td>{p.ClosingStock}</td>{isAdmin && <td><button onClick={()=>openEditModal(p)}>Edit</button><button onClick={()=>handleDelete(p.ProductID)}>Delete</button></td>}</tr>)}</tbody>
      </table>

      {showEditModal && <div className="modal-overlay"><div className="modal-content"><h3>Edit Product</h3>
        <input name="ProductName" placeholder="Product Name" value={editProduct.ProductName} onChange={handleEditChange}/>
        <input name="OpeningStock" type="number" placeholder="Opening Stock" value={editProduct.OpeningStock} onChange={handleEditChange}/>
        <input name="Production" type="number" placeholder="Production" value={editProduct.Production} onChange={handleEditChange}/>
        <input name="Dispatch" type="number" placeholder="Dispatch" value={editProduct.Dispatch} onChange={handleEditChange}/>
        <input name="ClosingStock" type="number" placeholder="Closing Stock" value={editProduct.ClosingStock} onChange={handleEditChange}/>
        <div className="modal-buttons"><button onClick={handleUpdate}>Update</button><button onClick={()=>setShowEditModal(false)}>Cancel</button></div>
      </div></div>}

      <button className="back-btn" onClick={()=>navigate("/products")}>← Back to Products</button>
    </div>
  );
}

export default Powder;
