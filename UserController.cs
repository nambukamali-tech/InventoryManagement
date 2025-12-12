using InventoryManagement.Models;
using Newtonsoft.Json;
using System;
using System.Data.SqlClient;
using System.Web.Mvc;
using InventoryManagement.Handlers;
using InventoryManagement.Helpers;

namespace InventoryManagement.Controllers
{
    public class UserController : Controller
    {
        string connection = @"Data Source=DESKTOP-EHPCDIL\SQLEXPRESS;Initial Catalog=JayKaySoaps;Integrated Security=True;";

        // SIGNUP
        [HttpPost]
        public JsonResult Signup()
        {
            try
            {
                Request.InputStream.Position = 0;
                string json = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
                UserModel user = JsonConvert.DeserializeObject<UserModel>(json);

                if (user == null || string.IsNullOrWhiteSpace(user.FullName) ||
                    string.IsNullOrWhiteSpace(user.Email) ||
                    string.IsNullOrWhiteSpace(user.Password) ||
                    string.IsNullOrWhiteSpace(user.Role))
                {
                    return Json(new { success = false, message = "All fields are required." });
                }

                using (SqlConnection con = new SqlConnection(connection))
                {
                    con.Open();

                    // Check if Email already exists
                    string checkQuery = "SELECT COUNT(*) FROM Users WHERE Email=@Email";
                    SqlCommand checkCmd = new SqlCommand(checkQuery, con);
                    checkCmd.Parameters.AddWithValue("@Email", user.Email);

                    int exists = (int)checkCmd.ExecuteScalar();
                    if (exists > 0)
                    {
                        return Json(new { success = false, message = "Email already registered." });
                    }

                    // HASH PASSWORD BEFORE SAVING
                    string hashedPassword = PasswordHelper.HashPassword(user.Password);

                    string insertQuery =
                        "INSERT INTO Users (FullName, Email, Password, Role) VALUES (@FullName, @Email, @Password, @Role)";
                    SqlCommand cmd = new SqlCommand(insertQuery, con);
                    cmd.Parameters.AddWithValue("@FullName", user.FullName);
                    cmd.Parameters.AddWithValue("@Email", user.Email);
                    cmd.Parameters.AddWithValue("@Password", hashedPassword);
                    cmd.Parameters.AddWithValue("@Role", user.Role);

                    cmd.ExecuteNonQuery();
                }

                return Json(new { success = true, message = "Signup successful!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        // LOGIN
        [HttpPost]
        public JsonResult Login()
        {
            try
            {
                Request.InputStream.Position = 0;
                string json = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
                UserModel user = JsonConvert.DeserializeObject<UserModel>(json);

                if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
                    return Json(new { success = false, message = "All fields are required." });

                using (SqlConnection con = new SqlConnection(connection))
                {
                    con.Open();

                    string query = "SELECT Password, FullName, Role FROM Users WHERE Email=@Email";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@Email", user.Email);

                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        string storedHash = reader["Password"].ToString();
                        string fullName = reader["FullName"].ToString();
                        string role = reader["Role"].ToString();

                        // VERIFY HASHED PASSWORD with STORED PASSWORD
                        if (PasswordHelper.VerifyPassword(user.Password, storedHash))
                        {
                            string token = JwtTokenGenerator.GenerateToken(fullName, role);

                            return Json(new
                            {
                                success = true,
                                message = $"Welcome {fullName}",
                                fullName,
                                role,
                                token
                            });
                        }

                        return Json(new { success = false, message = "Incorrect password." });
                    }

                    return Json(new { success = false, message = "Email not registered." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
