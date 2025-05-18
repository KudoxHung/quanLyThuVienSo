using System;
using System.Collections.Generic;
using DigitalLibary.Data.Entity;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class GroupDataOfOneIdAuditReceipt
    {
        public Guid IdAuditReceipt { get; set; }
        public string? AuditNumber { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? Status { get; set; }
        public DateTime? ReportCreateDate { get; set; }
        public DateTime? ReportToDate { get; set; }
        public Guid? IdAuditMethod { get; set; }
        public List<AuditBookListByIdDocument> Data { get; set; }
        public List<AuditorListByIdAuditReceipt> DataAuditor { get; set; }
    }
    public record AuditBookListByIdDocument
    {
        public Guid? DocumentId { get; set; }
        public string? BookName { get; set; }
        public string? TypeBook { get; set; }
        public Guid? IdTypeBook { get; set; }
        public float? Price { get; set; }
        public string? Author { get; set; }
        public string? Note { get; set; }
        public Guid? IdStatusBook { get; set; }
        public List<DataDocumentAndAuditBookListByIdAuditReceipt> Data { get; set; }
    }
}