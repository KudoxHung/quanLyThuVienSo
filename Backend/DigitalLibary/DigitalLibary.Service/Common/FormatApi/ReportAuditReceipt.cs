using System;
using System.Collections.Generic;
using DigitalLibary.Data.Entity;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class ReportAuditReceipt
    {
        public Guid IdAuditReceipt { get; set; }    
        public DateTime? ReportCreateDate { get; set; }
        public DateTime? ReportToDate { get; set; }
        public string? Note { get; set; }
        public Guid? IdAuditMethod { get; set; }
        public List<AuditorListByIdAuditReceipt> DataAuditor { get; set; }
        public ResultOfAuditReceipt DataQuantityDocument { get; set; }
        public List<ResultOfStatusBook> ResultOfStatusBooks { get; set; }
        public List<ReportAuditReceiptDetail> ResultReportAuditReceiptDetail { get; set; }
    }
    public record ResultOfAuditReceipt
    {
        public int? TotalBookInLibrary { get; set; }
        public List<DocumentTypeAndQuantity> Datas { get; set; }
    }
    public record ResultOfStatusBook
    {
        public string? StatusBook { get; set; }
        public int? Quantity { get; set; }
    }
    public record ReportAuditReceiptDetail
    {
        public Guid? DocumentTypeId { get; set; }
        public string? DocumentTypeName { get; set; }
        public List<DataDocumentAndAuditBookListByIdAuditReceipt> Datas { get; set; }
    }
}
