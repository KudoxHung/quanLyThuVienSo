using System;
using Microsoft.EntityFrameworkCore;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class DataDocumentAndAuditBookListByIdAuditReceipt
    {
        public string? BookName { get; set; }
        public Guid? IdBook { get; set; }
        public string? NumIndividual { get; set; }
        public Guid? IdIndividual { get; set; }
        public string? TypeBook { get; set; }
        public Guid? IdTypeBook { get; set; }
        public long? Price { get; set; }
        public string? Author { get; set; }
        public bool? WasLost { get; set; }
        public bool? Redundant { get; set; }
        public bool? IsLiquidation { get; set; }
        public Guid? IdStatusBook { get; set; }
        public string? NameStatusBook { get; set; }
        public string? Note { get; set; }
    }
}