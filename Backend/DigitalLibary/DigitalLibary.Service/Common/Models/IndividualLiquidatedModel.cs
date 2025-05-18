using System;
using System.Collections.Generic;

namespace DigitalLibary.Service.Common.Models
{
    public class IndividualLiquidatedModel
    {
        public string? NameAuditReceipt { get; set; } = string.Empty;
        public List<Guid> IdsIndividual { get; set; }
        public Guid IdAuditReceipt { get; set; }
    }
}