using System;

namespace DigitalLibary.Service.Dto
{
    public class AuditBookListDto
    {
        public Guid Id { get; set; }
        public Guid? IdDocument { get; set; }
        public bool? WasLost { get; set; }
        public bool? Redundant { get; set; }
        public Guid? IdStatusBook { get; set; }
        public bool? IsLiquidation { get; set; }
        public string? Note { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? IdAuditReceipt { get; set; }
        public Guid IdIndividualSample { get; set; }
        public float? Price { get; set; }
    }
}
