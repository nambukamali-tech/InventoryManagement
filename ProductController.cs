using InventoryManagement.Filters; // JWT filter namespace
using InventoryManagement.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Web.Mvc;

namespace InventoryManagement.Controllers
{
    public class ProductController : Controller
    {
        string connection = @"Data Source=DESKTOP-EHPCDIL\SQLEXPRESS;Initial Catalog=JayKaySoaps;Integrated Security=True;";

        // Helper to check if the current user is Admin
        private bool IsAdmin()
        {
            var principal = HttpContext.User as ClaimsPrincipal;
            var role = principal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            return role == "Admin";
        }

        [HttpGet]
        public JsonResult Get(string ProductType)
        {
            List<ProductModel> list = new List<ProductModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(connection))
                {
                    string query = @"SELECT ProductID, ProductName, OpeningStock, Production, Dispatch, ClosingStock, ProductType
                                     FROM Products
                                     WHERE ProductType = @ProductType";

                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ProductType", ProductType);

                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        list.Add(new ProductModel
                        {
                            ProductID = dr["ProductID"]?.ToString() ?? "",
                            ProductName = dr["ProductName"]?.ToString() ?? "",
                            OpeningStock = dr["OpeningStock"] != DBNull.Value ? Convert.ToInt32(dr["OpeningStock"]) : 0,
                            Production = dr["Production"] != DBNull.Value ? Convert.ToInt32(dr["Production"]) : 0,
                            Dispatch = dr["Dispatch"] != DBNull.Value ? Convert.ToInt32(dr["Dispatch"]) : 0,
                            ClosingStock = dr["ClosingStock"] != DBNull.Value ? Convert.ToInt32(dr["ClosingStock"]) : 0,
                            ProductType = dr["ProductType"]?.ToString() ?? ""
                        });
                    }
                }

                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Admin-only: Add Product
        [JwtAuthentication]
        [HttpPost]
        public JsonResult Add()
        {
            if (!IsAdmin())
                return Json(new { success = false, message = "Unauthorized: Admin access required." });

            try
            {
                string json = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
                var p = Newtonsoft.Json.JsonConvert.DeserializeObject<ProductModel>(json);
                if (string.IsNullOrWhiteSpace(p?.ProductName) || string.IsNullOrWhiteSpace(p?.ProductType))
                    return Json(new { success = false, message = "Product Name and Type are required." });

                string newProductID = "";

                using (SqlConnection con = new SqlConnection(connection))
                {
                    con.Open();
                    string prefix;
                    switch (p.ProductType.ToUpper())
                    {
                        case "DETERGENT":
                            prefix = "DET-";
                            break;
                        case "LIQUID":
                            prefix = "LIQ-";
                            break;
                        case "POWDER":
                            prefix = "POW-";
                            break;
                        default:
                            prefix = "GEN-";
                            break;
                    }

                    string idQuery = "SELECT TOP 1 ProductID FROM Products WHERE ProductType=@ProductType ORDER BY ProductID DESC";
                    SqlCommand cmd = new SqlCommand(idQuery, con);
                    cmd.Parameters.AddWithValue("@ProductType", p.ProductType);
                    var lastID = cmd.ExecuteScalar()?.ToString();

                    int nextNumber = 1;
                    if (!string.IsNullOrEmpty(lastID) && lastID.Contains("-"))
                    {
                        var parts = lastID.Split('-');
                        if (int.TryParse(parts[1], out int lastNum))
                            nextNumber = lastNum + 1;
                    }

                    newProductID = prefix + nextNumber.ToString("D3");
                }

                using (SqlConnection con = new SqlConnection(connection))
                {
                    string query = @"
                        INSERT INTO Products(ProductID, ProductName, OpeningStock, Production, Dispatch, ClosingStock, ProductType)
                        VALUES(@ProductID, @ProductName, @OpeningStock, @Production, @Dispatch, @ClosingStock, @ProductType)";

                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ProductID", newProductID);
                    cmd.Parameters.AddWithValue("@ProductName", p.ProductName);
                    cmd.Parameters.AddWithValue("@OpeningStock", p.OpeningStock);
                    cmd.Parameters.AddWithValue("@Production", p.Production);
                    cmd.Parameters.AddWithValue("@Dispatch", p.Dispatch);
                    cmd.Parameters.AddWithValue("@ClosingStock", p.ClosingStock);
                    cmd.Parameters.AddWithValue("@ProductType", p.ProductType);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return Json(new { success = true, message = "Product added successfully!", ProductID = newProductID });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Admin-only: Edit Product
        [JwtAuthentication]
        [HttpPost]
        public JsonResult Edit()
        {
            if (!IsAdmin())
                return Json(new { success = false, message = "Unauthorized: Admin access required." });

            try
            {
                string json = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
                var p = Newtonsoft.Json.JsonConvert.DeserializeObject<ProductModel>(json);

                if (string.IsNullOrWhiteSpace(p?.ProductID))
                    return Json(new { success = false, message = "Product ID is required." });

                using (SqlConnection con = new SqlConnection(connection))
                {
                    string query = @"
                        UPDATE Products 
                        SET ProductName=@ProductName, OpeningStock=@OpeningStock, Production=@Production, 
                            Dispatch=@Dispatch, ClosingStock=@ClosingStock
                        WHERE ProductID=@ProductID";

                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ProductID", p.ProductID);
                    cmd.Parameters.AddWithValue("@ProductName", p.ProductName ?? "");
                    cmd.Parameters.AddWithValue("@OpeningStock", p.OpeningStock);
                    cmd.Parameters.AddWithValue("@Production", p.Production);
                    cmd.Parameters.AddWithValue("@Dispatch", p.Dispatch);
                    cmd.Parameters.AddWithValue("@ClosingStock", p.ClosingStock);

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows == 0)
                        return Json(new { success = false, message = "Product not found." });
                }

                return Json(new { success = true, message = "Product updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Admin-only: Delete Product
        [JwtAuthentication]
        [HttpPost]
        public JsonResult Delete()
        {
            if (!IsAdmin())
                return Json(new { success = false, message = "Unauthorized: Admin access required." });

            try
            {
                string json = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
                dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
                string id = obj?.id;

                if (string.IsNullOrWhiteSpace(id))
                    return Json(new { success = false, message = "Product ID is required." });

                using (SqlConnection con = new SqlConnection(connection))
                {
                    string query = "DELETE FROM Products WHERE ProductID=@ProductID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ProductID", id);

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows == 0)
                        return Json(new { success = false, message = "Product not found." });
                }

                return Json(new { success = true, message = "Product deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
