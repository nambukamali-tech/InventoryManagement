using System;

namespace InventoryManagement.Models
{
    public class ProductModel
    {
        public string ProductID { get; set; }         
        public string ProductName { get; set; }      
        public int OpeningStock { get; set; }      
        public int Production { get; set; }     
        public int Dispatch { get; set; }       
        public int ClosingStock { get; set; }       
        public string ProductType { get; set; }        
    }
}
