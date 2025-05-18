using System;
using System.ComponentModel.DataAnnotations;

namespace DigitalLibary.Data.Entity
{
    public class VESRole
    {
        [Key] 
        public Guid Id { get; set; }
        public Guid IdVES { get; set; }
        public Guid IdUser { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}