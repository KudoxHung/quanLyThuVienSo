using Microsoft.EntityFrameworkCore;
using System;

namespace DigitalLibary.Data.Entity
{
    [Keyless]
    public class CustomApiNumIndividualLedger
    {
        public Guid IdIndividual { get; set; }
        public Guid DocumentTypeId { get; set; }
        public Guid DocumentId { get; set; }
        public string NameIndividual { get; set; }
        public string DocumentName { get; set; }
        public string Author { get; set; }
        public DateTime? DateIn { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? Publisher { get; set; }
        public string? DocumentStock { get; set; }
        public int? OrdinalNumber { get; set; }
        public string? PublishPlace { get; set; }
        public DateTime? PublishYear { get; set; }
        public long? Price { get; set; }
        public string? ReadingLevel { get; set; }
        public string? SignName { get; set; }
        public string? SignCode { get; set; }
        public string? ColorName { get; set; }
        public bool? WasLost { get; set; }
    }
}