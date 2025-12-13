using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventoryManagement.Models
{
    public class UserModel
    {
        
           
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }  // Admin or Employee
        

    }
}