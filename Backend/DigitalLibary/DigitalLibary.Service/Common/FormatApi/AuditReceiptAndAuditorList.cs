using DigitalLibary.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Common.FormatApi
{
    public class AuditReceiptAndAuditorList
    {
        public AuditReceipt auditReceipt { get; set; }

        public IEnumerable<AuditorList> auditorLists { get; set; }
    }
}
