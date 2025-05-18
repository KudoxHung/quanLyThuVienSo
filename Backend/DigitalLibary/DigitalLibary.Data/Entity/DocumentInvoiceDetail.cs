using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Data.Entity
{
    public class DocumentInvoiceDetail
    {
        public Guid Id { get; set; }
        public Guid? IdDocument { get; set; }
        public int? Status { get; set; }
        public Guid? CreateBy { get; set; }
        public DateTime? CreateDate { get; set; }
        public Guid IdDocumentInvoice { get; set; }
        public Guid IdIndividual { get; set; }
        public DateTime? DateIn { get; set; }
        public DateTime? DateOut { get; set; }
        public DateTime? DateInReality { get; set; }
        public bool? IsCompleted { get; set; }
        public string? Note { get; set; } // Ghi chú cho từng cuốn sách khi trả sách

    }
}
