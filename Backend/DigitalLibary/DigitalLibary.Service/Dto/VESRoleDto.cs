using System;

namespace DigitalLibary.Service.Dto
{
    public class VESRoleDto
    {
        public Guid Id { get; set; }
        public Guid IdVES { get; set; }
        public Guid IdUser { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}