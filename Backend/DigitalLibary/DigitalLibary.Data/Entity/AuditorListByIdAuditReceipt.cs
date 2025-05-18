using System;
using Microsoft.EntityFrameworkCore;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class AuditorListByIdAuditReceipt
    {
        public Guid? IdUser { get; set; }
        public string? UserName { get; set; }
        public Guid? UnitId { get; set; }
        public string? UnitName { get; set; }
        public Guid? UserTypeId { get; set; }
        public string? TypeName { get; set; }
        public string? DescriptionRole { get; set; }
        
        public int? Status { get; set; }
        public string? Name { get; set; }
        public string? Position { get; set; }
        public string? Role { get; set; }
        public string? Note { get; set; }
    }
}