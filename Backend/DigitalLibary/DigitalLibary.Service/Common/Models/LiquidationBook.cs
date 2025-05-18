using System;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.Models
{
    public class LiquidationBook
    {
        public List<Guid> IdIndividual { get; set; }
        public Guid IdAuditReceipt { get; set; }
        public string? Note { get; set; }
        public float? Price { get; set; }
    }
}