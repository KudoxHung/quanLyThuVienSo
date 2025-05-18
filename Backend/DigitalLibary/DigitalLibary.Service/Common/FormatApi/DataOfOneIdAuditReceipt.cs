using System;
using System.Collections.Generic;
using DigitalLibary.Data.Entity;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class DataOfOneIdAuditReceipt
    {
        public Guid IdAuditReceipt { get; set; }
        public DateTime? ReportCreateDate { get; set; }
        public DateTime? ReportToDate { get; set; }
        public string? Note { get; set; }
        public Guid? IdAuditMethod { get; set; }
        public List<DataDocumentAndAuditBookListByIdAuditReceipt> Datas { get; set; }
        public List<AuditorListByIdAuditReceipt> DataAuditor { get; set; }
    }
}
